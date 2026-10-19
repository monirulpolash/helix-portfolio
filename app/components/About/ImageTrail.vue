<script setup lang="ts">
import gsap from 'gsap'

// Same as the original AboutImageTrail: 24 stickers (12 images, repeated) behind the socials.
// Every 80px of mouse (or touch) travel the next sticker pops at the smoothed cursor position,
// slides to the real one, its image zooms 2.5 -> 1, then it shrinks and fades; each pop plays
// the "tick" sound. Stickers are own placeholders from /media/about/sticker-n.png.
type Item = { el: HTMLElement; inner: HTMLElement; rect: DOMRect }
const container = ref<HTMLElement | null>(null)
const audio = useAudio()
const THRESHOLD = 80
let items: Item[] = []
let index = 0
let z = 1
let raf = 0
const mouse = { x: 0, y: 0 }
let last = { x: 0, y: 0 }
const smooth = { x: 0, y: 0 }
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y)

function updateRects() {
  items.forEach((it) => { it.rect = it.el.getBoundingClientRect(); gsap.set(it.el, { opacity: 0, scale: 1 }) })
}
function onMove(e: MouseEvent) {
  const r = container.value!.getBoundingClientRect()
  mouse.x = e.clientX; mouse.y = e.clientY - r.top
}
function onTouch(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  const r = container.value!.getBoundingClientRect()
  mouse.x = t.clientX; mouse.y = t.clientY - r.top
}
function showNext() {
  const it = items[index]
  if (!it) return
  index = (index + 1) % items.length
  z++
  audio.play('tick')
  gsap.killTweensOf(it.el)
  gsap.timeline()
    .fromTo(it.el,
      { opacity: 1, scale: 0, x: smooth.x - it.rect.width / 2, y: smooth.y - it.rect.height / 2, zIndex: z },
      { duration: 0.4, scale: 1, x: mouse.x - it.rect.width / 2, y: mouse.y - it.rect.height / 2, ease: 'power2.out' }, 0)
    .fromTo(it.inner, { scale: 2.5 }, { scale: 1, duration: 0.4 }, 0)
    .to(it.el, { opacity: 0, scale: 0.2, duration: 0.4 }, 0.45)
}
function render() {
  smooth.x = lerp(smooth.x, mouse.x, 0.1)
  smooth.y = lerp(smooth.y, mouse.y, 0.1)
  if (dist(mouse, last) > THRESHOLD) { showNext(); last = { ...mouse } }
  raf = requestAnimationFrame(render)
}

onMounted(() => {
  const c = container.value
  if (!c) return
  items = [...c.querySelectorAll<HTMLElement>('.image-wrapper')].map((el) => ({
    el, inner: el.querySelector('.image-inner') as HTMLElement, rect: el.getBoundingClientRect(),
  }))
  updateRects()
  window.addEventListener('resize', updateRects)
  c.addEventListener('mousemove', onMove)
  c.addEventListener('touchmove', onTouch)
  raf = requestAnimationFrame(render)
})
onBeforeUnmount(() => {
  container.value?.removeEventListener('mousemove', onMove)
  container.value?.removeEventListener('touchmove', onTouch)
  window.removeEventListener('resize', updateRects)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="container" class="image-trail">
    <div v-for="i in 24" :key="i" class="image-wrapper">
      <img class="image-inner" :src="`/media/about/sticker-${((i - 1) % 12) + 1}.png`" alt="">
    </div>
  </div>
</template>

<style scoped>/* layout from the original AboutImageTrail component */
.image-trail {
  height: 100%;
  left: 0;
  overflow: visible;
  pointer-events: all;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}
.image-wrapper {
  position: absolute;
  will-change: transform, opacity;
}
.image-inner {
  height: auto;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 150px;
}

@media screen and (max-width: 900px) {.image-inner {
    width: 100px;
  }

}</style>