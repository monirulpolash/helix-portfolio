import { DoubleSide, Mesh, ShaderMaterial, Vector2, type PlaneGeometry, type Texture } from 'three'
import { HELIX, MOTION, SHADER } from './config'
import { planeFragment, planeVertex } from './shaders'

export interface HelixProject {
  slug: string
  title: string
  year?: string
  image: string
}

/** One card on the helix. */
export class ProjectPlane {
  mesh: Mesh<PlaneGeometry, ShaderMaterial>
  hover = 0
  hoverTarget = 0
  hidden = 1
  hiddenTarget = 1
  isHidden = true

  constructor(
    public project: HelixProject,
    public projectIndex: number,
    public index: number,
    geometry: PlaneGeometry,
    texture: Texture,
  ) {
    const image = texture.image as { width?: number; height?: number } | undefined
    const material = new ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uColorStrength: { value: 0 },
        uZoom: { value: 1 },
        uPlaneSizes: { value: new Vector2(HELIX.planeWidth, HELIX.planeHeight) },
        uImageSizes: { value: new Vector2(image?.width || 16, image?.height || 9) },
        uRevealProgress: { value: 0 },
        uScrollSpeed: { value: 0 },
        uBow: { value: SHADER.bow },
        uCurve: { value: SHADER.curve },
        uSpeedBend: { value: SHADER.speedBend },
        uCornerRadius: { value: SHADER.cornerRadius },
      },
      vertexShader: planeVertex,
      fragmentShader: planeFragment,
      transparent: true,
      side: DoubleSide,
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.scale.set(HELIX.planeWidth, HELIX.planeHeight, 1)
    this.mesh.userData.plane = this
  }

  setTexture(texture: Texture) {
    const u = this.mesh.material.uniforms
    u.uTexture.value = texture
    const image = texture.image as { width?: number; height?: number } | undefined
    if (image?.width && image?.height) u.uImageSizes.value.set(image.width, image.height)
  }

  hide(delay: number) {
    return window.setTimeout(() => {
      this.isHidden = true
      this.hiddenTarget = 1
    }, delay)
  }

  reveal(delay: number) {
    return window.setTimeout(() => {
      this.isHidden = false
      this.hiddenTarget = 0
    }, delay)
  }

  update(dt: number, offset: number, speed: number, count: number) {
    const hoverRate = this.hoverTarget ? MOTION.hoverIn : MOTION.hoverOut
    this.hover += (this.hoverTarget - this.hover) * (1 - Math.pow(1 - hoverRate, dt * MOTION.hoverTimeScale))
    this.hidden += (this.hiddenTarget - this.hidden) * (1 - Math.pow(1 - MOTION.hideRate, dt * MOTION.hideTimeScale))

    // Where this card sits on the helix: its slot relative to the centre of the list.
    const center = Math.floor(count / 2)
    let slot = this.index - offset
    slot = ((slot % count) + count) % count
    const rel = slot - center
    const angle = rel * HELIX.angleGap
    const radius = HELIX.radius * (1 - this.hidden / 2)
    const drop = this.isHidden ? MOTION.drop : -MOTION.drop
    const y = rel * HELIX.verticalGap + HELIX.yOffset - this.hidden * drop

    this.mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
    this.mesh.rotation.y = Math.PI / 2 - angle

    const u = this.mesh.material.uniforms
    u.uColorStrength.value = SHADER.colorStrength * this.hover
    u.uZoom.value = 1 + SHADER.zoom * this.hover
    u.uRevealProgress.value = (1 - SHADER.hoverShrink * this.hover) * (1 - this.hidden)
    u.uScrollSpeed.value = speed

    this.mesh.visible = this.hidden < 0.999
  }

  dispose() {
    this.mesh.material.dispose()
  }
}
