import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Smooth scroll with the original's settings, driven by the GSAP ticker and synced to ScrollTrigger.
export default defineNuxtPlugin((nuxt) => {
  const lenis = new Lenis({
    wheelMultiplier: 0.8, infinite: false, gestureOrientation: 'vertical', duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), autoRaf: false, autoResize: true,
  })
  gsap.registerPlugin(ScrollTrigger)
  let last = 0
  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    const dir = scroll > last ? 'down' : scroll < last ? 'up' : 'still'
    last = scroll
    ScrollTrigger.update()
    document.body.setAttribute('data-scroll', scroll === 0 ? 'top' : dir)
  })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  addEventListener('resize', () => ScrollTrigger.refresh())
  nuxt.hook('page:finish', () => ScrollTrigger.refresh())
  return { provide: { lenis } }
})
