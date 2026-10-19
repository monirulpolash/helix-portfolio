<script setup lang="ts">
import gsap from 'gsap'

// Same as the original UiSolidButton: a pill whose letters jiggle (random rotation and scale,
// then an elastic settle) on hover. Renders <a target=_blank> when given a link, else <button>.
const props = defineProps<{ label: string; link?: string }>()
const buttonRef = ref<HTMLElement | null>(null)
const letters = ref<HTMLElement[]>([])
const audio = useAudio()
let tl: gsap.core.Timeline | null = null
const onEnter = () => tl?.restart()

onMounted(() => {
  if (!buttonRef.value) return
  tl = gsap.timeline({ paused: true })
  tl.to(letters.value, {
    rotation: () => gsap.utils.random(-15, 15), scale: () => gsap.utils.random(1.15, 1.4),
    fontWeight: 600, duration: 0.25, ease: 'power2.out', stagger: { amount: 0.25 },
  }).to(letters.value, { rotation: 0, scale: 1, fontWeight: 500, duration: 0.25, ease: 'elastic.out(1, 0.8)', stagger: { amount: 0.25 } })
  buttonRef.value.addEventListener('mouseenter', onEnter)
})
onBeforeUnmount(() => { buttonRef.value?.removeEventListener('mouseenter', onEnter); tl?.kill() })
</script>

<template>
  <a v-if="props.link" ref="buttonRef" :href="props.link" target="_blank" rel="noopener noreferrer" class="button" @click="audio.play('click')">
    <span class="hidden-label">{{ props.label }}</span>
    <div class="animated-label">
      <span v-for="(l, i) in props.label.split('')" :key="i" ref="letters" class="letter">{{ l === ' ' ? '\u00a0' : l }}</span>
    </div>
  </a>
  <button v-else ref="buttonRef" class="button" @click="audio.play('click')">
    <span class="hidden-label">{{ props.label }}</span>
    <div class="animated-label">
      <span v-for="(l, i) in props.label.split('')" :key="i" ref="letters" class="letter">{{ l === ' ' ? '\u00a0' : l }}</span>
    </div>
  </button>
</template>

<style scoped>
/* layout from the original UiSolidButton component */
.button {
  align-items: center;
  background-color: var(--color-white);
  border-radius: 50rem;
  color: var(--color-bg-dark);
  display: inline-flex;
  font-size: 18rem;
  font-weight: 500;
  padding: 14rem;
  position: relative;
  white-space: nowrap;
  width: -moz-fit-content;
  width: fit-content;
  will-change: transform;
}
.button.dark {
  background-color: var(--color-bg-dark);
  color: var(--color-white);
}
.button.dark:after {
  background-color: var(--color-white);
}
.button .hidden-label {
  color: var(--color-white);
  opacity: 0;
  visibility: hidden;
}
.button .animated-label {
  left: calc(50% - 8rem);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
.button .letter {
  display: inline-block;
  will-change: transform;
}
.button:after {
  background-color: var(--color-bg-dark);
  border-radius: 50%;
  content: "";
  display: inline-block;
  height: 6rem;
  margin-left: 8rem;
  width: 6rem;
}
</style>
