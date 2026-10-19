<script setup lang="ts">
// Stand-in for the original's Lottie smiley logo (face1, face3, face4, face5).
// Same contract: prop `name`, `autoplay`, `loop`, exposed play(); every play() pops the face
// and redraws its expression. The artwork is an own placeholder smiley, not the original.
const props = withDefaults(defineProps<{ name?: string; autoplay?: boolean; loop?: boolean }>(), { name: 'face1', autoplay: true, loop: false })
const emit = defineEmits<{ onComplete: []; onAnimationLoaded: [] }>()
const playing = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

const faces: Record<string, { eyes: string; mouth: string }> = {
  face1: { eyes: 'M23 26v6M41 26v6', mouth: 'M20 40c6 7 18 7 24 0' },
  face3: { eyes: 'M20 29c2-3 5-3 7 0M37 29c2-3 5-3 7 0', mouth: 'M22 40c5 9 15 9 20 0z' },
  face4: { eyes: 'M23 26v6M37 29c2-3 5-3 7 0', mouth: 'M22 42c4 3 12 3 18-2' },
  face5: { eyes: 'M20 26l6 4-6 4M44 26l-6 4 6 4', mouth: 'M26 41a6 5 0 0 0 12 0z' },
}
const face = computed(() => faces[props.name] ?? faces.face1!)

function play() {
  playing.value = false
  clearTimeout(t)
  requestAnimationFrame(() => {
    playing.value = true
    t = setTimeout(() => { playing.value = false; emit('onComplete') }, 700)
  })
}
onMounted(() => { emit('onAnimationLoaded'); if (props.autoplay) play() })
onBeforeUnmount(() => clearTimeout(t))
defineExpose({ play })
</script>

<template>
  <div class="lottie-animation-container face" :class="{ playing }">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="var(--color-pop-green)" />
      <path :key="name + 'e'" class="stroke" :d="face.eyes" stroke="var(--color-bg-dark)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path :key="name + 'm'" class="stroke" :d="face.mouth" stroke="var(--color-bg-dark)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<style scoped>
.face { height: 100%; width: 100%; overflow: visible; }
.face svg { display: block; height: 100%; width: 100%; }
.face.playing svg { animation: face-pop 0.7s var(--ease-spring); }
.face.playing .stroke { animation: face-draw 0.45s ease-out; stroke-dasharray: 60; }
@keyframes face-pop { 0% { transform: scale(0.6) rotate(-20deg); } 60% { transform: scale(1.08) rotate(6deg); } 100% { transform: scale(1) rotate(0); } }
@keyframes face-draw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
</style>
