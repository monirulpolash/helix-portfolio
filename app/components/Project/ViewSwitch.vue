<script setup lang="ts">
// Same as the original ProjectViewSwitch: "spiral • list" toggle, top centre. Each label is
// doubled so hover / active rolls the second copy in. Switching plays a sound and hides or
// reveals the WebGL cards; the list itself (ProjectList) watches homeView.mode.
const experienceStore = useExperienceStore()
const homeView = useHomeViewStore()
const audio = useAudio()
function setMode(mode: 'spiral' | 'list') {
  if (homeView.mode === mode) return
  homeView.setMode(mode)
  const e = experienceStore.experience
  if (!e) return
  if (mode === 'spiral') { audio.play('spiral'); e.world.revealProjects() }
  else { audio.play('list'); e.world.hideProjects() }
}
</script>

<template>
  <div class="switch">
    <div class="button" :class="{ active: homeView.mode === 'spiral' }">
      <button @click="setMode('spiral')">
        <span>spiral</span>
        <span>spiral</span>
      </button>
    </div>
    <span class="dot" />
    <div class="button" :class="{ active: homeView.mode === 'list' }">
      <button @click="setMode('list')">
        <span>list</span>
        <span>list</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* layout from the original ProjectViewSwitch component */
.switch {
  align-items: center;
  display: flex;
  gap: 20rem;
  left: 50%;
  position: fixed;
  top: calc(var(--grid-margin) + 15rem);
  transform: translate(-50%);
  z-index: 20;
}
.switch .button {
  border: none;
  color: var(--color-white);
  display: flex;
  font-size: 18rem;
  font-weight: 500;
  min-width: 60rem;
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
}
.switch .button:first-child {
  justify-content: flex-end;
}
.switch .button button {
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
.switch .button button span {
  display: block;
  transition:
    transform 0.3s var(--ease-spring),
    opacity 0.3s ease;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.switch .button button span:nth-child(2) {
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
}
.switch .button button:hover span:first-child {
  opacity: 0;
  transform: translateY(100%);
}
.switch .button button:hover span:nth-child(2) {
  opacity: 1;
  transform: translateY(0);
}
.switch .button.active {
  opacity: 1;
}
.switch .button.active button span:first-child {
  opacity: 0;
  transform: translateY(100%);
}
.switch .button.active button span:nth-child(2) {
  opacity: 1;
  transform: translateY(0);
}
.switch .dot {
  background-color: var(--color-white);
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
}
</style>
