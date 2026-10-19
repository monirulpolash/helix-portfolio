<script setup lang="ts">
// Same as the original ProjectNextProjectProgressBar: a thin vertical bar beside the next-project
// image. Once the page is scrolled to the very bottom, extra downward wheel delta (up to 1000)
// fills it (lerped); full = go to the next project with the "longclick" sound. Pausing the
// wheel for 150ms or scrolling back up empties it.
const props = defineProps<{ path: string; height: number }>()
const MAX = 1000
const router = useRouter()
const audio = useAudio()
const progress = ref(0)
let target = 0
const atBottom = ref(false)
const active = ref(false)
let acc = 0
let lastWheel = Date.now()
let raf = 0
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function tick() {
  progress.value = lerp(progress.value, target, target === 0 ? 0.05 : 0.1)
  if (active.value && Date.now() - lastWheel > 150) { target = 0; acc = 0 }
  raf = requestAnimationFrame(tick)
}
function onScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
  atBottom.value = bottom
  if (!bottom && active.value) { active.value = false; target = 0; acc = 0; return }
  if (bottom && !active.value) active.value = true
}
function onWheel(e: WheelEvent) {
  if (!active.value) return
  lastWheel = Date.now()
  if (e.deltaY <= 0) return
  acc = Math.min(acc + e.deltaY, MAX)
  target = acc / MAX
  if (target >= 1) {
    active.value = false
    setTimeout(() => { router.push(props.path); audio.play('longclick') }, 300)
  }
}

onMounted(() => {
  raf = requestAnimationFrame(tick)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: false })
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  document.body.style.overflow = ''
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar" :style="{ height: `${props.height}px` }">
      <div class="progress-fill" :style="{ transform: `scaleY(${progress})` }" />
    </div>
  </div>
</template>

<style scoped>/* layout from the original ProjectNextProjectProgressBar component */
.progress-bar-wrapper {
  align-items: center;
  bottom: 0;
  display: flex;
  height: 100%;
  position: absolute;
  right: var(--grid-margin);
  top: 0;
  width: 6rem;
}
.progress-bar-wrapper .progress-bar {
  background-color: var(--color-white20);
  border-radius: 100rem;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.progress-bar-wrapper .progress-bar .progress-fill {
  background-color: var(--color-white);
  border-radius: 100rem;
  height: 100%;
  transform: scaleY(0);
  transform-origin: center center;
  width: 6rem;
}

@media screen and (max-width: 900px) {.progress-bar-wrapper {
    display: none;
  }

}</style>
