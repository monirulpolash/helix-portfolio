<script setup lang="ts">
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { portfolio } from '~~/data/portfolio.js'

// Same flow as the original LoaderTest: the intro animation plays, the tagline drops in line
// by line when it ends, and the two enter buttons show once the spiral textures have loaded
// (experience.isReady). "enter with sound" starts the ambient loop; "enter without sound" mutes
// first. Either one sets hasEntered, which slides the loader down and reveals the spiral.
const experienceStore = useExperienceStore()
const audioStore = useAudioStore()
const audio = useAudio()
const animationDone = ref(false)
const animationLoaded = ref(false)
const text = ref<HTMLElement | null>(null)
let split: SplitText | null = null

onMounted(() => {
  if (!text.value) return
  gsap.registerPlugin(SplitText)
  split = new SplitText(text.value, { type: 'lines', tag: 'span', linesClass: 'line' })
  gsap.set(split.lines, { yPercent: -100, opacity: 0 })
})
watch(animationDone, (done) => {
  if (!done || !split) return
  gsap.to(split.lines, { yPercent: 0, opacity: 1, stagger: { each: 0.1 }, ease: 'power1.out', duration: 0.6 })
})
onBeforeUnmount(() => split?.revert())

const show = computed(() => experienceStore.isReady && animationDone.value)
function enterWithSound() {
  audio.play('ambient', true)
  experienceStore.setHasEntered()
}
function enterWithoutSound() {
  audio.mute(true)
  audio.play('ambient', true)
  audioStore.setEnabled(false)
  experienceStore.setHasEntered()
}
</script>

<template>
  <Transition name="loader">
    <div v-if="!experienceStore.hasEntered" class="loader">
      <ClientOnly>
        <UiLoaderMark class="lottie" @on-complete="animationDone = true" @on-animation-loaded="animationLoaded = true" />
      </ClientOnly>
      <p ref="text" class="text" :style="{ opacity: animationLoaded ? 1 : 0 }">
        {{ portfolio.site.tagline }}
      </p>
      <UiSolidButton :class="['enter', show && 'show']" label="enter with sound" @click="enterWithSound" />
      <button :class="['no-sound', show && 'show']" @click="enterWithoutSound">
        enter without sound
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* layout from the original LoaderTest component */
.loader {
  align-items: center;
  background: var(--color-bg-dark);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  font-size: 24rem;
  font-weight: 500;
  inset: 0;
  justify-content: center;
  position: fixed;
  transform-origin: top center;
  transition: transform 0.5s var(--ease-quad-in-out);
  z-index: 1000;
}
.loader .lottie {
  height: auto;
  margin-bottom: 24rem;
}
.loader .lottie,.loader .text {
  margin-top: -100rem;
  max-width: calc(100% - var(--grid-margin) * 2);
  width: 300px;
}
.loader .text {
  font-size: 24rem;
  margin-bottom: 32rem;
  overflow: hidden;
  text-align: center;
}
.loader .text .line {
  display: block;
  overflow: hidden;
}
.loader .enter {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  transition-delay: 0.2s;
}
.loader .enter.show {
  opacity: 1;
  pointer-events: auto;
}
.loader .no-sound {
  background: none;
  bottom: var(--grid-margin);
  color: var(--color-white);
  cursor: pointer;
  font-size: 14rem;
  font-weight: 400;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transform: translateY(20);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
  transition-delay: 0.3s;
}
.loader .no-sound.show {
  opacity: 0.7;
  pointer-events: all;
  transform: translateY(0);
}
.loader .no-sound:before {
  background-color: var(--color-white);
  bottom: -2rem;
  content: "";
  height: 0.5rem;
  position: absolute;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.15s ease-in-out;
  width: 100%;
  z-index: -1;
}
.loader .no-sound:hover:before {
  transform: scaleX(1);
  transform-origin: left;
}
.loader .percentage {
  bottom: var(--grid-margin);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  left: var(--grid-margin);
  margin: 0;
  position: absolute;
  right: var(--grid-margin);
}
.loader span {
  display: inline-block;
  width: calc(100% - 35rem);
}
.loader-leave-active {
  transform: translateY(0);
}
.loader-leave-active p {
  transition: opacity 0.3s ease-out;
}
.loader-leave-to {
  transform: translateY(100%);
}
.loader-leave-to p {
  opacity: 0;
}
</style>
