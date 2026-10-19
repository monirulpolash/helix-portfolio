<script setup lang="ts">
// Same as the original OthersSoundButton: bottom-right white disc that mutes / unmutes
// everything, with the icon swap blurred and rotated by the global "iconfade" transition.
const audioStore = useAudioStore()
const audio = useAudio()
function toggle() {
  if (audioStore.enabled) { audio.play('click'); audio.mute(true) }
  else { audio.mute(false); audio.play('click') }
  audioStore.setEnabled(!audioStore.enabled)
}
</script>

<template>
  <button class="sound-button" :aria-label="audioStore.enabled ? 'mute sound' : 'unmute sound'" @click="toggle">
    <Transition name="iconfade">
      <IconsSoundOnIcon v-if="audioStore.enabled" key="on" />
      <IconsSoundOffIcon v-else key="off" class="absolute" />
    </Transition>
    <div class="background" />
  </button>
</template>

<style scoped>
/* layout from the original OthersSoundButton component */
.sound-button {
  align-items: center;
  border-radius: 50%;
  bottom: var(--grid-margin);
  color: var(--color-bg-dark);
  display: flex;
  height: 48rem;
  justify-content: center;
  pointer-events: all;
  position: fixed;
  right: var(--grid-margin);
  width: 48rem;
  z-index: 10;
}
.sound-button .absolute {
  position: absolute;
}
.sound-button .background {
  background-color: var(--color-white);
  border-radius: 50%;
  height: 100%;
  position: absolute;
  transition: transform 0.15s ease-out;
  width: 100%;
  z-index: -1;
}
.sound-button svg {
  height: 16rem;
  width: 16rem;
}

@media screen and (hover: hover) and (pointer: fine) {.sound-button:hover .background {
    transform: scale(0.9);
  }

}
</style>
