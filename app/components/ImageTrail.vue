<script setup lang="ts">
// A trail of project images that follows the cursor on the about page (desktop only).
// Plain DOM + CSS transitions, no animation library.
const props = defineProps<{ images: string[] }>()

interface Item { id: number; src: string; x: number; y: number; r: number }
const items = ref<Item[]>([])
const root = ref<HTMLElement | null>(null)
let id = 0
let next = 0
let lastX = -999
let lastY = -999
const SPACING = 110 // px of movement between images
const LIFETIME = 900

function onMove(e: MouseEvent) {
  if (!props.images.length) return
  const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
  if (dist < SPACING) return
  lastX = e.clientX
  lastY = e.clientY
  const rect = root.value?.getBoundingClientRect()
  const item: Item = {
    id: id++,
    src: props.images[next++ % props.images.length]!,
    x: e.clientX - (rect?.left ?? 0),
    y: e.clientY - (rect?.top ?? 0),
    r: (Math.random() - 0.5) * 16,
  }
  items.value.push(item)
  if (items.value.length > 8) items.value.shift()
  window.setTimeout(() => {
    items.value = items.value.filter((i) => i.id !== item.id)
  }, LIFETIME)
}

onMounted(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', onMove, { passive: true })
  }
})
onBeforeUnmount(() => window.removeEventListener('mousemove', onMove))
</script>

<template>
  <div ref="root" class="trail" aria-hidden="true">
    <TransitionGroup name="trail">
      <img
        v-for="item in items"
        :key="item.id"
        :src="item.src"
        alt=""
        :style="{ left: `${item.x}px`, top: `${item.y}px`, '--r': `${item.r}deg` }"
      >
    </TransitionGroup>
  </div>
</template>

<style scoped>
.trail {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.trail img {
  position: absolute;
  width: clamp(140px, 16vw, 240px);
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 6px;
  transform: translate(-50%, -50%) rotate(var(--r));
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}
.trail-enter-active {
  transition: transform 0.5s var(--ease), opacity 0.3s;
}
.trail-leave-active {
  transition: transform 0.5s var(--ease), opacity 0.5s;
}
.trail-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(var(--r)) scale(0.6);
}
.trail-leave-to {
  opacity: 0;
  transform: translate(-50%, -30%) rotate(var(--r)) scale(0.9);
}
</style>
