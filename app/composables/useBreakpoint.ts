import { reactive, ref, toRefs, onMounted } from 'vue'

const breakpoints = { small: 1200, medium: 1400, tablet: 1024, tabletPortrait: 900, phone: 740, phonePortrait: 420 }

// Same breakpoints and hover / touch media queries as the original.
export function useBreakpoint() {
  const bp = reactive({ small: false, medium: false, tablet: false, tabletPortrait: false, phone: false, phonePortrait: false })
  const hover = ref(false)
  const touch = ref(false)
  // any input can hover (a touchscreen laptop with a trackpad, an iPad with a trackpad)
  const anyHover = ref(false)
  const watchMq = (q: string, cb: (m: MediaQueryList | MediaQueryListEvent) => void) => {
    const mq = matchMedia(q)
    cb(mq)
    mq.addEventListener('change', cb)
  }
  onMounted(() => {
    Object.entries(breakpoints).forEach(([k, px]) => watchMq(`(max-width: ${px}px)`, (m) => { (bp as any)[k] = m.matches }))
    watchMq('(hover: hover) and (pointer: fine)', (m) => { hover.value = m.matches })
    watchMq('(hover: none)', (m) => { touch.value = m.matches })
    watchMq('(any-hover: hover) and (any-pointer: fine)', (m) => { anyHover.value = m.matches })
  })
  return { ...toRefs(bp), hover, touch, anyHover }
}
