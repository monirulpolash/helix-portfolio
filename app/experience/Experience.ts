// WebGL spiral. Same structure as the original engine: Experience owns Sizes, Time, Controls,
// Camera, Raycaster, Renderer, PostProcessing (edge fade), Resources (one texture per project)
// and World (two copies of every project as curved planes on a helix).
import {
  Color, DoubleSide, Mesh, PerspectiveCamera, PlaneGeometry, Raycaster as ThreeRaycaster, Scene,
  ShaderMaterial, Texture, TextureLoader, Uniform, Vector2, WebGLRenderer, NoToneMapping,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { planeVertex, planeFragment, fadeVertex, fadeFragment } from './shaders'

type Project = { title: string; slug: string; thumbnail: string }
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

class Emitter {
  private cb: Record<string, Function[]> = {}
  on(n: string, f: Function) { (this.cb[n] ||= []).push(f); return this }
  off(n: string) { delete this.cb[n]; return this }
  trigger(n: string, a: any[] = []) { this.cb[n]?.forEach((f) => f(...a)) }
}

export type Hooks = { navigate: (slug: string) => void; play: (sound: string) => void; hover: (p: Project | null) => void; progress?: (l: number, t: number) => void }

class Sizes extends Emitter {
  width = innerWidth; height = innerHeight; pixelRatio = Math.min(devicePixelRatio, 2)
  private onResize = () => {
    this.width = innerWidth; this.height = innerHeight; this.pixelRatio = Math.min(devicePixelRatio, 2)
    this.trigger('resize')
  }
  constructor() { super(); addEventListener('resize', this.onResize) }
  destroy() { removeEventListener('resize', this.onResize) }
}

class Time extends Emitter {
  elapsed = 0; delta = 16; private last = performance.now(); private raf: number | null = null; private running = false
  constructor() { super(); this.startLoop() }
  startLoop() { if (this.running) return; this.running = true; this.last = performance.now(); this.loop() }
  loop = () => {
    if (!this.running) return
    const now = performance.now()
    this.delta = Math.min(now - this.last, 50); this.last = now; this.elapsed += this.delta
    this.trigger('tick'); this.raf = requestAnimationFrame(this.loop)
  }
  pause() { this.running = false; if (this.raf !== null) cancelAnimationFrame(this.raf); this.raf = null }
  resume() { this.startLoop() }
}

// Wheel and horizontal swipe drive an eased, never-quite-stopping scroll offset.
class Controls extends Emitter {
  easing = 0.1; wheelDeltaY = 0; targetWheelDeltaY = 0; minWheelSpeed = 0.002; wheelDirection = 1; scrollOffset = 0
  normalizedMouse = new Vector2(0, 0); isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; isPaused = false
  private startX = 0; private lastX = 0; private velocity = 0; private dragging = false
  constructor(private e: Experience) {
    super()
    const c = e.canvas
    c.addEventListener('wheel', this.onWheel, { passive: true })
    if (this.isTouchDevice) {
      c.addEventListener('touchstart', this.onTouchStart, { passive: true })
      c.addEventListener('touchmove', this.onTouchMove, { passive: false })
      c.addEventListener('touchend', this.onTouchEnd)
    } else {
      c.addEventListener('click', this.onClick)
      addEventListener('mousemove', this.onMouseMove)
    }
  }
  onWheel = (ev: WheelEvent) => {
    if (this.isPaused) return
    this.targetWheelDeltaY = clamp(this.targetWheelDeltaY + ev.deltaY * 15e-5, -2, 2)
    this.wheelDirection = ev.deltaY > 0 ? 1 : -1
  }
  onMouseMove = (ev: MouseEvent) => {
    if (this.isPaused) return
    this.normalizedMouse.set((ev.clientX / this.e.sizes.width) * 2 - 1, -(ev.clientY / this.e.sizes.height) * 2 + 1)
  }
  onClick = (ev: MouseEvent) => { if (!this.isPaused) this.trigger('click', [ev]) }
  onTouchStart = (ev: TouchEvent) => {
    const t = ev.touches[0]
    if (this.isPaused || !t) return
    this.startX = this.lastX = t.clientX; this.velocity = 0; this.dragging = false
  }
  onTouchMove = (ev: TouchEvent) => {
    const t = ev.touches[0]
    if (this.isPaused || !t) return
    if (!this.dragging && Math.abs(t.clientX - this.startX) > 8) this.dragging = true
    if (this.dragging) {
      ev.preventDefault()
      const m = -(t.clientX - this.lastX) * 0.5
      this.targetWheelDeltaY = clamp(this.targetWheelDeltaY - m * 0.003, -2, 2)
      this.wheelDirection = m < 0 ? 1 : -1; this.velocity = m
    }
    this.lastX = t.clientX
  }
  onTouchEnd = (ev: TouchEvent) => {
    if (this.isPaused) return
    if (this.dragging) this.targetWheelDeltaY = clamp(this.targetWheelDeltaY - this.velocity * 0.002, -2, 2)
    else this.trigger('tap', [ev])
    this.dragging = false; this.velocity = 0
  }
  update() {
    this.wheelDeltaY += (this.targetWheelDeltaY - this.wheelDeltaY) * this.easing
    this.scrollOffset += this.wheelDeltaY
    if (Math.abs(this.targetWheelDeltaY) < this.minWheelSpeed) this.targetWheelDeltaY = this.wheelDirection * this.minWheelSpeed
    this.targetWheelDeltaY *= 0.9
  }
  destroy() {
    const c = this.e.canvas
    c.removeEventListener('wheel', this.onWheel); c.removeEventListener('click', this.onClick)
    removeEventListener('mousemove', this.onMouseMove)
    c.removeEventListener('touchstart', this.onTouchStart); c.removeEventListener('touchmove', this.onTouchMove); c.removeEventListener('touchend', this.onTouchEnd)
  }
}

export class Logics {
  hasEntered = false; menuOpened = false
  toggleMenu(v: boolean | null = null) { this.menuOpened = v === null ? !this.menuOpened : v }
}

class ProjectPlane extends Mesh<PlaneGeometry, ShaderMaterial> {
  isHovered = false; hoverProgress = 0; hoverTarget = 0; isHidden = true; hiddenProgress = 1; hiddenTarget = 1
  verticalGap = 0.5; angleGap = 0.85; baseRadius = 2; centerIndex: number
  constructor(private e: Experience, public index: number, public project: Project, private count: number, geo: PlaneGeometry) {
    super(geo)
    this.centerIndex = Math.floor(count / 2)
    this.scale.set(1.7, 1, 1)
    const tex = e.textures[project.slug]!
    this.material = new ShaderMaterial({
      uniforms: {
        uTexture: new Uniform(tex), uColorStrength: new Uniform(0), uZoom: new Uniform(1),
        uPlaneSizes: new Uniform(new Vector2(1.7, 1)), uImageSizes: new Uniform(new Vector2(tex.image.width, tex.image.height)),
        uRevealProgress: new Uniform(0), uScrollSpeed: new Uniform(0),
      },
      vertexShader: planeVertex, fragmentShader: planeFragment, transparent: true, side: DoubleSide,
    })
    e.scene.add(this); this.update()
  }
  reveal() { this.isHidden = false; this.hiddenTarget = 0 }
  hide() { this.isHidden = true; this.hiddenTarget = 1 }
  setHovered(v: boolean) { this.isHovered = v; this.hoverTarget = v ? 1 : 0 }
  update() {
    const dt = this.e.time.delta, c = this.e.controls
    const dir = this.isHidden ? 1.5 : -1.5
    this.hoverProgress = lerp(this.hoverProgress, this.hoverTarget, 1 - Math.pow(1 - (this.isHovered ? 0.09 : 0.07), dt * 0.2))
    this.hiddenProgress = lerp(this.hiddenProgress, this.hiddenTarget, 1 - Math.pow(0.95, dt * 0.15))
    let n = this.index - c.scrollOffset
    n = ((n % this.count) + this.count) % this.count
    const k = n - this.centerIndex
    const y = k * this.verticalGap - 0.8 - this.hiddenProgress * dir
    const r = this.baseRadius * (1 - this.hiddenProgress / 2)
    const a = k * this.angleGap
    this.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
    this.rotation.y = -a + Math.PI / 2
    const u = this.material.uniforms
    u.uColorStrength!.value = 0.55 * this.hoverProgress
    u.uZoom!.value = 1 + 0.05 * this.hoverProgress
    u.uRevealProgress!.value = (1 - this.hoverProgress * 0.05) * (1 - this.hiddenProgress)
    u.uScrollSpeed!.value = c.wheelDeltaY
  }
}

class World {
  planes: ProjectPlane[] = []; hovered: ProjectPlane | null = null
  constructor(private e: Experience, projects: Project[]) {
    const geo = new PlaneGeometry(1, 1, 8, 8), count = projects.length * 2
    ;[...projects, ...projects].forEach((p, i) => this.planes.push(new ProjectPlane(e, i, p, count, geo)))
    e.controls.on('click', () => {
      if (this.hovered && this.hovered.hiddenProgress < 0.01 && e.isActive) {
        e.canvas.style.cursor = 'default'; e.hooks.play('longclick'); e.hooks.navigate(this.hovered.project.slug); this.hideProjects()
      }
    })
    e.controls.on('tap', (ev: TouchEvent) => {
      if (!e.isActive || e.logics.menuOpened) return
      const p = this.tapped(ev)
      if (p) { e.hooks.play('longclick'); e.hooks.navigate(p.project.slug); this.hideProjects() }
    })
  }
  private frontHit() {
    const hit = this.e.raycaster.intersectObjects(this.planes)[0]
    if (!hit) return null
    const front = hit.face!.normal.clone().transformDirection(hit.object.matrixWorld).dot(this.e.raycaster.ray.direction) < 0
    return { plane: hit.object as ProjectPlane, front }
  }
  private tapped(ev: TouchEvent) {
    const t = ev.changedTouches[0]
    if (!t) return null
    this.e.controls.normalizedMouse.set((t.clientX / this.e.sizes.width) * 2 - 1, -(t.clientY / this.e.sizes.height) * 2 + 1)
    this.e.raycaster.setFromCamera(this.e.controls.normalizedMouse, this.e.camera)
    const h = this.frontHit()
    return h && h.front && h.plane.hiddenProgress < 0.01 ? h.plane : null
  }
  private clearHover() {
    this.e.canvas.style.cursor = 'default'; this.hovered?.setHovered(false); this.hovered = null; this.e.hooks.hover(null)
  }
  checkHovered() {
    if (this.e.controls.isTouchDevice || this.e.logics.menuOpened) return
    const h = this.frontHit()
    if (!h) return this.clearHover()
    if (this.hovered === h.plane) return
    this.hovered?.setHovered(false)
    if (h.front && !h.plane.isHovered && h.plane.hiddenProgress < 0.01 && this.e.isActive) {
      this.hovered = h.plane; h.plane.setHovered(true); this.e.canvas.style.cursor = 'pointer'
      this.e.hooks.play('hover'); this.e.hooks.hover(h.plane.project)
    } else this.clearHover()
  }
  hideProjects() { this.planes.forEach((p, i) => setTimeout(() => p.hide(), (i % 4) * 30)) }
  revealProjects() { this.e.resume(); this.planes.forEach((p, i) => setTimeout(() => p.reveal(), (i % 4) * 50)) }
  update() { this.checkHovered(); this.planes.forEach((p) => p.update()) }
}

export class Experience {
  isActive = true
  sizes = new Sizes(); time = new Time(); scene = new Scene(); logics = new Logics()
  controls: Controls; camera: PerspectiveCamera; raycaster = new ThreeRaycaster(); renderer: WebGLRenderer; composer: EffectComposer
  textures: Record<string, Texture> = {}; world?: World
  constructor(public canvas: HTMLCanvasElement, projects: Project[], public hooks: Hooks) {
    this.controls = new Controls(this)
    const s = this.sizes
    this.camera = new PerspectiveCamera(s.width < 900 ? 45 : 35, s.width / s.height, 0.1, 100)
    this.camera.position.set(0, 0, 8); this.scene.add(this.camera)
    this.renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false })
    this.renderer.toneMapping = NoToneMapping; this.renderer.setClearColor(0x0e0e0e, 0)
    this.renderer.setSize(s.width, s.height); this.renderer.setPixelRatio(s.pixelRatio)
    const fade = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uFillColor: { value: new Color('#444') } }, vertexShader: fadeVertex, fragmentShader: fadeFragment })
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera)); this.composer.addPass(fade)
    // Resources: one 512px texture per project thumbnail; World is built when all are loaded.
    const loader = new TextureLoader(); let loaded = 0
    projects.forEach((p) => loader.load(p.thumbnail, (t) => {
      this.textures[p.slug] = t; loaded++; hooks.progress?.(loaded, projects.length)
      if (loaded === projects.length) this.world = new World(this, projects)
    }))
    s.on('resize', () => this.resize()); this.time.on('tick', () => this.update())
  }
  resize() {
    const s = this.sizes
    this.camera.aspect = s.width / s.height; this.camera.fov = s.width < 900 ? 45 : 35; this.camera.updateProjectionMatrix()
    this.renderer.setSize(s.width, s.height); this.renderer.setPixelRatio(s.pixelRatio)
    this.composer.setSize(s.width, s.height); this.composer.setPixelRatio(s.pixelRatio)
  }
  pause() { if (!this.isActive) return; this.isActive = false; this.time.pause(); this.controls.isPaused = true }
  resume() { if (this.isActive) return; this.isActive = true; this.time.resume(); this.controls.isPaused = false }
  update() {
    if (!this.isActive) return
    this.raycaster.setFromCamera(this.controls.normalizedMouse, this.camera)
    this.controls.update(); this.composer.render(); this.world?.update()
  }
  destroy() {
    this.sizes.destroy(); this.time.pause(); this.controls.destroy()
    Object.values(this.textures).forEach((t) => t.dispose())
    this.scene.traverse((m) => { if (m instanceof Mesh) { m.geometry.dispose(); m.material.dispose() } })
    this.composer.dispose(); this.renderer.dispose(); this.renderer.forceContextLoss()
  }
}
