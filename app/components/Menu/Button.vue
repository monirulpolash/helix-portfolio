<script setup lang="ts">
import gsap from 'gsap'

// Same as the original MenuButton: a "menu" pill whose letters jiggle on hover, and a
// separate "× close" button that takes over once the panel is open.
const props = defineProps<{ isMenuOpen: boolean }>()
const emit = defineEmits<{ click: [] }>()
const audio = useAudio()
const letters = ref<HTMLElement[]>([])
const buttonRef = ref<HTMLElement | null>(null)
let tl: gsap.core.Timeline | null = null
const onEnter = () => tl?.restart()

onMounted(() => {
  if (!buttonRef.value) return
  tl = gsap.timeline({ paused: true })
  tl.to(letters.value, {
    rotation: () => gsap.utils.random(-15, 15), scale: () => gsap.utils.random(1.15, 1.4),
    fontWeight: 600, duration: 0.25, ease: 'power2.out', stagger: 0.05,
  }).to(letters.value, { rotation: 0, scale: 1, fontWeight: 500, duration: 0.25, ease: 'elastic.out(1, 0.8)', stagger: 0.05 })
  buttonRef.value.addEventListener('mouseenter', onEnter)
})
onBeforeUnmount(() => { buttonRef.value?.removeEventListener('mouseenter', onEnter); tl?.kill() })

function openClick() { if (!props.isMenuOpen) { emit('click'); audio.play('click') } }
function closeClick() { if (props.isMenuOpen) { emit('click'); audio.play('close') } }
</script>

<template>
  <div class="wrapper">
    <button ref="buttonRef" class="button" :class="isMenuOpen ? 'opened' : 'closed'" :aria-expanded="isMenuOpen" @click="openClick">
      <div class="text">
        <span v-for="(l, i) in 'menu'.split('')" :key="i" ref="letters" class="letter" :class="isMenuOpen ? 'hide' : ''">{{ l }}</span>
      </div>
    </button>
    <button class="close-button" :class="isMenuOpen ? 'opened' : 'closed'" @click="closeClick">
      <IconsCrossIcon />
      <span class="text">close</span>
    </button>
  </div>
</template>

<style scoped>
/* layout from the original MenuButton component */
.wrapper {
  height: -moz-fit-content;
  height: fit-content;
  width: -moz-fit-content;
  width: fit-content;
}
.button,.wrapper {
  position: relative;
  z-index: 30;
}
.button {
  align-items: center;
  border: none;
  border-radius: 100rem;
  color: var(--color-bg-dark);
  cursor: pointer;
  display: flex;
  font-size: 18rem;
  font-weight: 500;
  padding: 15rem 28rem 15rem 15rem;
  pointer-events: all;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.button .text {
  transform-origin: left center;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transition-delay: 0.35s;
}
.button.opened {
  cursor: default;
}
.button.opened .text {
  opacity: 0;
  transform: translate(5px);
  transition-delay: 0s;
}
.button .letter {
  display: inline-block;
  transition: none;
}
.close-button {
  align-items: center;
  background: var(--color-bg-dark);
  border-radius: 24rem;
  display: flex;
  height: 48rem;
  justify-content: center;
  margin-left: 7rem;
  position: absolute;
  right: 20rem;
  top: 20rem;
  transform-origin: top right;
  transition:
    transform 0.8s var(--ease-spring),
    right 0.8s var(--ease-spring),
    top 0.8s var(--ease-spring);
  width: 48rem;
  z-index: 30;
}
.close-button svg {
  color: var(--color-white);
  transition:
    transform 0.5s ease,
    opacity 0.3s ease;
}
.close-button .text {
  color: var(--color-bg-dark);
  font-size: 18rem;
  font-weight: 500;
  left: -50rem;
  position: absolute;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transition-delay: 0.2s;
}
.close-button.closed {
  pointer-events: none;
  right: 15rem;
  top: 20rem;
  transform: scale(0.125);
}
.close-button.closed svg {
  opacity: 0;
  transform: rotate(-45deg);
}
.close-button.closed .text {
  opacity: 0;
  transform: translate(20px);
  transition-delay: 0s;
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}
.close-button.opened {
  pointer-events: auto;
}
</style>
