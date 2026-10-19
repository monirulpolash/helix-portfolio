<script setup lang="ts">
// Same as the original OthersHeaderLogo: a fixed top-left smiley; each click moves to the
// next face (face1, face3, face4, face5), plays smiley1..4 and replays the animation.
const lottieRef = ref<{ play: () => void } | null>(null)
const faces = ['face1', 'face3', 'face4', 'face5']
const index = ref(0)
const audio = useAudio()
function next() {
  index.value = (index.value + 1) % faces.length
  if (lottieRef.value) {
    audio.play(`smiley${index.value + 1}`)
    lottieRef.value.play()
  }
}
</script>

<template>
  <div class="wrapper">
    <UiLogoFace ref="lottieRef" class="logo" :name="faces[index]" :autoplay="true" :loop="false" @click="next" />
    <OthersHeaderLogoTag />
  </div>
</template>

<style scoped>
/* layout from the original OthersHeaderLogo component */
.wrapper {
  cursor: pointer;
  height: 64rem;
  left: var(--grid-margin);
  position: fixed;
  top: var(--grid-margin);
  width: 64rem;
  z-index: 20;
}
.wrapper .logo-tag-wrapper {
  opacity: 0;
  transform: scale(0.5) translate(-10%);
  transform-origin: left center;
  transition:
    opacity 0.2s ease-out,
    transform 0.5s var(--ease-spring);
}

@media screen and (hover: hover) and (pointer: fine) {.wrapper:hover .logo-tag-wrapper {
    opacity: 1;
    transform: scale(1) rotate(-5deg) translate(0) translateY(-12rem);
  }

}
.wrapper:active .logo-tag-wrapper {
  transform: scale(0.95) rotate(-5deg) translate(0) translateY(-12rem);
}
.logo {
  height: 100%;
  transition: transform 0.2s ease-out;
  width: 100%;
}
.logo:active {
  transform: scale(0.9);
}
</style>
