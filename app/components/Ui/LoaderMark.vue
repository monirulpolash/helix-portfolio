<script setup lang="ts">
// Stand-in for the original's "loader" Lottie: plays once on mount, emits onAnimationLoaded
// right away and onComplete when it ends (about 2s, like the original 48-frame animation
// at 25fps). Own placeholder artwork: a smiley drawn stroke by stroke, then a spin.
const emit = defineEmits<{ onComplete: []; onAnimationLoaded: [] }>()
let t: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  emit('onAnimationLoaded')
  t = setTimeout(() => emit('onComplete'), 1950)
})
onBeforeUnmount(() => clearTimeout(t))
</script>

<template>
  <div class="lottie-animation-container loader-mark">
    <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class="spin">
        <circle class="draw ring" cx="150" cy="60" r="52" stroke="var(--color-pop-green)" stroke-width="6" />
        <path class="draw eyes" d="M132 46v12M168 46v12" stroke="var(--color-white)" stroke-width="7" stroke-linecap="round" />
        <path class="draw mouth" d="M124 72c14 16 38 16 52 0" stroke="var(--color-white)" stroke-width="7" stroke-linecap="round" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.loader-mark { overflow: visible; width: 100%; }
.loader-mark svg { display: block; height: auto; width: 100%; }
.draw { stroke-dasharray: 340; stroke-dashoffset: 340; animation: lm-draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.eyes { animation-delay: 0.6s; }
.mouth { animation-delay: 0.8s; }
.spin { transform-box: fill-box; transform-origin: center; animation: lm-spin 0.6s var(--ease-spring) 1.35s both; }
@keyframes lm-draw { to { stroke-dashoffset: 0; } }
@keyframes lm-spin { 0% { transform: scale(1) rotate(0); } 50% { transform: scale(0.85) rotate(-12deg); } 100% { transform: scale(1) rotate(0); } }
</style>
