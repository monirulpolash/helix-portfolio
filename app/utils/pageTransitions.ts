import type { TransitionProps } from 'vue'
import type Lenis from 'lenis'

// Same page transitions as the original: "fade" for / and /about, "project" (rise + scale) for
// /projects/[slug], both out-in. Lenis stops while the old page leaves, the new page starts at
// the top, then Lenis restarts and re-measures. Without this, ScrollTriggers of the new page
// would initialise at the old scroll position.
const lenis = () => useNuxtApp().$lenis as Lenis | undefined
const hooks = {
  onBeforeLeave() { lenis()?.stop() },
  onBeforeEnter() { window.scrollTo(0, 0); lenis()?.scrollTo(0, { immediate: true }) },
  onAfterEnter() { const l = lenis(); l?.start(); l?.resize() },
}

export const basicPageTransition: TransitionProps = { name: 'fade', mode: 'out-in', ...hooks }
export const projectPageTransition: TransitionProps = { name: 'project', mode: 'out-in', ...hooks }
