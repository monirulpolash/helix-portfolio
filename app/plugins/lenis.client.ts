import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Smooth scrolling for the regular pages (project, about), like the reference.
 * The home page has no page scroll: its helix uses the custom controller in experience/Controls.ts.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduced ? null : new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true })

  const router = useRouter()
  router.afterEach(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
  })

  nuxtApp.hook('page:finish', () => {
    lenis?.resize()
  })

  return { provide: { lenis } }
})
