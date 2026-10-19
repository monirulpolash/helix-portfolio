import { MathUtils, Vector2 } from 'three'
import { SCROLL } from './config'

/**
 * The custom wheel / swipe controller. No Lenis, no GSAP:
 * input pushes a `target` speed, `speed` eases towards it, `offset` integrates speed,
 * and the target decays with friction down to a small idle drift.
 *
 * Frame-rate independent: the per-frame factors are tuned for 60 fps and scaled by dt,
 * so a 120 Hz screen spins at the same pace (the reference site runs twice as fast there).
 */
export class Controls {
  speed = 0
  target = 0
  dir = 1
  offset = 0
  /** Pointer in normalised device coordinates. Starts off-screen. */
  mouse = new Vector2(9, 9)
  usingMouse = false
  paused = true

  private touch = { startX: 0, startY: 0, lastX: 0, lastY: 0, velocity: 0, dragging: false, axis: 'x' as 'x' | 'y' }

  constructor(
    private canvas: HTMLCanvasElement,
    private sizes: { width: number; height: number },
    private handlers: { onClick: () => void; onTap: (x: number, y: number) => void },
  ) {
    canvas.addEventListener('wheel', this.onWheel, { passive: false })
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false })
    canvas.addEventListener('touchend', this.onTouchEnd, { passive: false })
    canvas.addEventListener('click', this.onClick)
    window.addEventListener('mousemove', this.onMouseMove, { passive: true })
    window.addEventListener('keydown', this.onKeyDown)
  }

  private clamp(v: number) {
    return MathUtils.clamp(v, -SCROLL.maxSpeed, SCROLL.maxSpeed)
  }

  private push(amount: number) {
    this.target = this.clamp(this.target + amount)
    if (amount !== 0) this.dir = amount > 0 ? 1 : -1
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (this.paused) return
    // Normalise line / page deltas (Firefox) to pixels.
    const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? this.sizes.height : 1
    const delta = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit
    this.push(delta * SCROLL.wheelFactor)
  }

  private onMouseMove = (e: MouseEvent) => {
    this.usingMouse = true
    this.mouse.set((e.clientX / this.sizes.width) * 2 - 1, -(e.clientY / this.sizes.height) * 2 + 1)
  }

  private onClick = () => {
    if (this.paused || !this.usingMouse) return
    this.handlers.onClick()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.paused) return
    const t = e.target as HTMLElement | null
    if (t && /input|textarea|select/i.test(t.tagName)) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') this.push(SCROLL.keyStep * 4)
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') this.push(-SCROLL.keyStep * 4)
  }

  private onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    this.usingMouse = false
    this.mouse.set(9, 9)
    const s = this.touch
    s.startX = s.lastX = t.clientX
    s.startY = s.lastY = t.clientY
    s.velocity = 0
    s.dragging = false
  }

  private onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    const s = this.touch
    const dx = t.clientX - s.startX
    const dy = t.clientY - s.startY
    if (!s.dragging && Math.hypot(dx, dy) > SCROLL.dragThreshold) {
      s.dragging = true
      // Sideways swipes turn the helix like the reference; vertical swipes do too, which feels natural on phones.
      s.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
    }
    if (s.dragging) {
      e.preventDefault()
      if (!this.paused) {
        const step = s.axis === 'x' ? t.clientX - s.lastX : -(t.clientY - s.lastY)
        this.push(step * SCROLL.touchFactor)
        s.velocity = step
      }
    }
    s.lastX = t.clientX
    s.lastY = t.clientY
  }

  private onTouchEnd = (e: TouchEvent) => {
    const s = this.touch
    if (s.dragging) {
      if (!this.paused) this.push(s.velocity * SCROLL.touchFling)
    } else if (!this.paused) {
      const t = e.changedTouches[0]
      if (t) {
        e.preventDefault() // stop the emulated mouse click from firing a second open
        this.handlers.onTap(t.clientX, t.clientY)
      }
    }
    s.dragging = false
    s.velocity = 0
  }

  setPointer(x: number, y: number) {
    this.mouse.set((x / this.sizes.width) * 2 - 1, -(y / this.sizes.height) * 2 + 1)
  }

  update(dt: number) {
    const f = dt / (1000 / 60)
    this.speed += (this.target - this.speed) * (1 - Math.pow(1 - SCROLL.easing, f))
    this.offset += this.speed * f
    if (Math.abs(this.target) < SCROLL.minSpeed) this.target = this.dir * SCROLL.minSpeed // idle drift
    this.target *= Math.pow(SCROLL.friction, f)
  }

  dispose() {
    this.canvas.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('touchstart', this.onTouchStart)
    this.canvas.removeEventListener('touchmove', this.onTouchMove)
    this.canvas.removeEventListener('touchend', this.onTouchEnd)
    this.canvas.removeEventListener('click', this.onClick)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
