import {
  Color,
  DataTexture,
  Vector3,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  RGBAFormat,
  Scene,
  TextureLoader,
  WebGLRenderer,
  type Texture,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { CAMERA, HELIX, LOOK, MOTION, SHADER } from './config'
import { Controls } from './Controls'
import { ProjectPlane, type HelixProject } from './ProjectPlane'
import { fadeFragment, fadeVertex } from './shaders'

/** Raw sRGB components of a hex colour. The shaders work in the image's own colour space, so no linear conversion. */
function srgbVector(hex: string) {
  const c = new Color()
  c.setStyle(hex, 'srgb-linear') // keeps the numbers as written
  return new Vector3(c.r, c.g, c.b)
}

export interface ExperienceCallbacks {
  onProgress?: (progress: number) => void
  onReady?: () => void
  onHover?: (project: HelixProject | null) => void
  onOpen?: (project: HelixProject) => void
}

/**
 * The whole WebGL home page: renderer, camera, composer, textures, the helix of cards,
 * hover / click picking and the render loop. Created once and kept alive across routes;
 * the page components only call reveal(), hide() and setActive().
 */
export class Experience {
  ready = false
  private sizes = { width: window.innerWidth, height: window.innerHeight, pixelRatio: 1 }
  private scene = new Scene()
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private composer: EffectComposer
  private fadePass: ShaderPass
  private controls: Controls
  private raycaster = new Raycaster()
  private geometry = new PlaneGeometry(1, 1, 8, 8)
  private textures: Texture[] = []
  private planes: ProjectPlane[] = []
  private hovered: ProjectPlane | null = null
  private timers: number[] = []
  private active = false
  private rafId = 0
  private last = performance.now()

  constructor(
    private canvas: HTMLCanvasElement,
    private projects: HelixProject[],
    private callbacks: ExperienceCallbacks = {},
  ) {
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio || 1, LOOK.maxPixelRatio)

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false })
    this.renderer.toneMapping = NoToneMapping
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(this.sizes.width, this.sizes.height, false)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

    this.camera = new PerspectiveCamera(this.fov(), this.sizes.width / this.sizes.height, CAMERA.near, CAMERA.far)
    this.camera.position.set(0, 0, CAMERA.z)
    this.scene.add(this.camera)

    this.composer = new EffectComposer(this.renderer)
    this.composer.setPixelRatio(this.sizes.pixelRatio)
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.fadePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uFillColor: { value: srgbVector(LOOK.fillColor) },
        uEdge: { value: SHADER.fadeEdge },
      },
      vertexShader: fadeVertex,
      fragmentShader: fadeFragment,
    })
    this.composer.addPass(this.fadePass)

    this.controls = new Controls(canvas, this.sizes, {
      onClick: () => {
        if (this.hovered && this.hovered.hidden < 0.01) this.open(this.hovered)
      },
      onTap: (x, y) => {
        this.controls.setPointer(x, y)
        const plane = this.pick()
        if (plane) this.open(plane)
      },
    })

    this.buildPlanes()
    this.loadTextures()

    window.addEventListener('resize', this.onResize)
    this.rafId = requestAnimationFrame(this.tick)
  }

  private fov() {
    return this.sizes.width < CAMERA.breakpoint ? CAMERA.fovMobile : CAMERA.fovDesktop
  }

  /** A 1x1 grey texture so the cards exist before (or if) an image fails to load. */
  private fallbackTexture() {
    const t = new DataTexture(new Uint8Array([90, 90, 90, 255]), 1, 1, RGBAFormat)
    t.needsUpdate = true
    ;(t as any).image.width = 16
    ;(t as any).image.height = 9
    return t
  }

  private buildPlanes() {
    const fallback = this.fallbackTexture()
    this.textures = this.projects.map(() => fallback)
    const list = Array.from({ length: HELIX.copies }, () => this.projects).flat()
    list.forEach((project, index) => {
      const projectIndex = index % this.projects.length
      const plane = new ProjectPlane(project, projectIndex, index, this.geometry, fallback)
      this.scene.add(plane.mesh)
      this.planes.push(plane)
    })
  }

  private loadTextures() {
    const loader = new TextureLoader()
    let settled = 0
    const total = this.projects.length
    const done = () => {
      settled++
      this.callbacks.onProgress?.(settled / total)
      if (settled === total) {
        this.ready = true
        this.callbacks.onReady?.()
      }
    }
    this.projects.forEach((project, i) => {
      loader.load(
        project.image,
        (texture) => {
          texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy())
          this.textures[i] = texture
          for (const p of this.planes) if (p.projectIndex === i) p.setTexture(texture)
          done()
        },
        undefined,
        () => {
          // A broken image must not block the site (the reference waits forever).
          console.warn(`[helix] could not load ${project.image}`)
          done()
        },
      )
    })
    if (total === 0) {
      this.ready = true
      this.callbacks.onReady?.()
    }
  }

  /** The card under the pointer, if it faces the camera and is fully shown. */
  private pick(): ProjectPlane | null {
    this.raycaster.setFromCamera(this.controls.mouse, this.camera)
    const hits = this.raycaster.intersectObjects(
      this.planes.filter((p) => p.mesh.visible).map((p) => p.mesh),
      false,
    )
    const hit = hits[0]
    if (!hit || !hit.face) return null
    const plane = hit.object.userData.plane as ProjectPlane
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
    const facing = normal.dot(this.raycaster.ray.direction) < 0
    return facing && plane.hidden < 0.01 ? plane : null
  }

  private setHovered(plane: ProjectPlane | null) {
    if (plane === this.hovered) return
    if (this.hovered) this.hovered.hoverTarget = 0
    this.hovered = plane
    if (plane) plane.hoverTarget = 1
    this.canvas.style.cursor = plane ? 'pointer' : ''
    this.callbacks.onHover?.(plane ? plane.project : null)
  }

  private open(plane: ProjectPlane) {
    this.setHovered(null)
    this.hide()
    this.callbacks.onOpen?.(plane.project)
  }

  private clearTimers() {
    this.timers.forEach((t) => clearTimeout(t))
    this.timers = []
  }

  /** Cards fall into place in staggered groups of four. */
  reveal(delay = 0) {
    this.clearTimers()
    this.planes.forEach((p, i) => this.timers.push(p.reveal(delay + (i % 4) * MOTION.revealStagger)))
  }

  /** Cards sink and fade out. */
  hide() {
    this.clearTimers()
    this.setHovered(null)
    this.planes.forEach((p, i) => this.timers.push(p.hide((i % 4) * MOTION.hideStagger)))
  }

  /** Active on the home page: input is live. Inactive: input is ignored and rendering stops once the cards are gone. */
  setActive(active: boolean) {
    this.active = active
    this.controls.paused = !active
    if (!active) this.setHovered(null)
  }

  private onResize = () => {
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio || 1, LOOK.maxPixelRatio)
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.fov = this.fov()
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(this.sizes.pixelRatio)
    this.renderer.setSize(this.sizes.width, this.sizes.height, false)
    this.composer.setPixelRatio(this.sizes.pixelRatio)
    this.composer.setSize(this.sizes.width, this.sizes.height)
  }

  private tick = (now: number) => {
    this.rafId = requestAnimationFrame(this.tick)
    const dt = Math.min(now - this.last, 50)
    this.last = now

    const anyVisible = this.planes.some((p) => p.hidden < 0.999 || p.hiddenTarget < 1)
    if (!this.active && !anyVisible) return // nothing on screen: skip the GPU work

    this.controls.update(dt)
    if (this.active && this.controls.usingMouse) this.setHovered(this.pick())
    const count = this.planes.length
    for (const p of this.planes) p.update(dt, this.controls.offset, this.controls.speed, count)
    this.composer.render()
  }

  dispose() {
    cancelAnimationFrame(this.rafId)
    this.clearTimers()
    window.removeEventListener('resize', this.onResize)
    this.controls.dispose()
    this.planes.forEach((p) => p.dispose())
    this.geometry.dispose()
    new Set(this.textures).forEach((t) => t.dispose())
    this.fadePass.dispose()
    this.composer.dispose()
    this.renderer.dispose()
  }
}
