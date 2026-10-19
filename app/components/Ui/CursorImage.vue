<script setup lang="ts">
// Same as the original UiCursorImage (list view): a 16:9 thumbnail stack that follows the
// mouse with a lerp (0.1), scales to 1 while a project is hovered and back to 0.5 when not,
// keeps the last 5 hovered thumbnails stacked (each new one pops in with fadeInScale) and
// clears the stack once it has faded out.
import type { Project } from '~/composables/stores'

const props = defineProps<{ project: Project | null }>()

type Item = Project & { _cursorId: string }
const images = ref<Item[]>([])
const pos = ref({ x: 0, y: 0 })
const scale = ref(0)
const target = { x: 0, y: 0 }
const mouse = { x: 0, y: 0 }
let raf = 0
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
let uid = 0

function tick() {
  pos.value.x = lerp(pos.value.x, target.x, 0.1)
  pos.value.y = lerp(pos.value.y, target.y, 0.1)
  scale.value = lerp(scale.value, props.project !== null ? 1 : 0.5, 0.07)
  if (scale.value <= 0.01 && props.project === null && images.value.length > 0) images.value = []
  raf = requestAnimationFrame(tick)
}
function update() {
  const r = document.body.getBoundingClientRect()
  target.x = mouse.x - r.left
  target.y = mouse.y - r.top
}
const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; update() }
const onScroll = () => update()

watch(() => props.project, (p) => {
  if (!p) return
  const item: Item = { ...p, _cursorId: `${p.slug}-${++uid}` }
  if (images.value.length >= 5) images.value.shift()
  if (images.value[images.value.length - 1]?.slug !== item.slug) images.value.push(item)
})

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  tick()
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    class="cursor-wrapper"
    :class="{ hide: project === null }"
    :style="{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-25%, -75%) scale(${scale})` }"
  >
    <img
      v-for="img in images"
      :key="img._cursorId"
      class="cursor-image"
      :src="img.thumbnail"
      :alt="`Thumbnail image of ${img.title}`"
    >
  </div>
</template>

<style scoped>/* layout from the original UiCursorImage component */
.cursor-wrapper {
  aspect-ratio: 16/9;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  transform-origin: center;
  transition: opacity 0.3s var(--ease-expo-out);
  width: 330rem;
  will-change: transform;
  z-index: 0;
}
.cursor-wrapper.hide {
  opacity: 0;
}
.cursor-image {
  animation: fadeInScale 0.5s var(--ease-expo-out) forwards;
  aspect-ratio: 16/9;
  background-color: var(--color-bg-dark);
  border-radius: 12rem;
  left: 0;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  position: absolute;
  top: 0;
  transform-origin: center;
  width: 330rem;
  will-change: transform, opacity;
}
.cursor-image.show {
  opacity: 1;
  transform: scale(1);
}</style>
