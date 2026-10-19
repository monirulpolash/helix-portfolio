<script setup lang="ts">
// End of a project page: keep scrolling (wheel or swipe) past the bottom to fill the bar
// and move to the next project, or just click it.
const props = defineProps<{ project: { slug: string; title: string; image: string } }>()
const { $audio } = useNuxtApp()

const THRESHOLD = 1000 // px of over-scroll needed
const progress = ref(0)
let idle = 0
let touchY = 0
let leaving = false

const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

function add(amount: number) {
  if (leaving) return
  progress.value = Math.min(1, Math.max(0, progress.value + amount / THRESHOLD))
  clearTimeout(idle)
  idle = window.setTimeout(() => (progress.value = 0), 450)
  if (progress.value >= 1) go()
}

function go() {
  if (leaving) return
  leaving = true
  $audio.play('open')
  navigateTo(`/projects/${props.project.slug}`)
}

function onWheel(e: WheelEvent) {
  if (e.deltaY > 0 && atBottom()) add(e.deltaY)
}
function onTouchStart(e: TouchEvent) {
  touchY = e.touches[0]?.clientY ?? 0
}
function onTouchMove(e: TouchEvent) {
  const y = e.touches[0]?.clientY ?? 0
  const dy = touchY - y
  touchY = y
  if (dy > 0 && atBottom()) add(dy * 2.5)
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
})
onBeforeUnmount(() => {
  clearTimeout(idle)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
})
</script>

<template>
  <section class="next">
    <NuxtLink :to="`/projects/${project.slug}`" class="next-link" @click="$audio.play('open')">
      <span class="eyebrow">Next project</span>
      <span class="next-title">{{ project.title }}</span>
      <img :src="project.image" alt="" loading="lazy" decoding="async">
    </NuxtLink>
    <div class="next-progress" aria-hidden="true">
      <div class="next-bar" :style="{ transform: `scaleX(${progress})` }" />
      <span>Keep scrolling</span>
    </div>
  </section>
</template>

<style scoped>
.next {
  max-width: 1400px;
  margin: clamp(5rem, 14vw, 12rem) auto 0;
  padding-bottom: calc(var(--gutter) * 2 + env(safe-area-inset-bottom));
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.next-link {
  position: relative;
  display: grid;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}
.next-title {
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.85;
  transition: transform 0.6s var(--ease);
}
.next-link img {
  width: min(420px, 60vw);
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  justify-self: end;
  filter: grayscale(1);
  transition: filter 0.5s var(--ease);
}
.next-link:hover img { filter: none; }
.next-link:hover .next-title { transform: translateX(1rem); }
.next-progress {
  margin-top: 2rem;
  display: grid;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.6;
}
.next-bar {
  height: 2px;
  background: var(--fg);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.15s linear;
}
</style>
