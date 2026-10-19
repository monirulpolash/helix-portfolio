<script setup lang="ts">
// Same as the original MenuMainMenu: <nav> with the button, the panel and the click-away
// overlay. Toggling also tells the WebGL scene (logics.menuOpened) so it ignores input.
const menu = useMenuStore()
const experienceStore = useExperienceStore()
function toggle() { menu.toggleMenu(); experienceStore.toggleMenu() }
</script>

<template>
  <nav class="wrapper">
    <MenuButton :is-menu-open="menu.isOpened" @click="toggle" />
    <MenuContent :is-menu-open="menu.isOpened" />
    <Transition name="fade">
      <MenuOverlay v-if="menu.isOpened" @click="toggle" />
    </Transition>
  </nav>
</template>

<style scoped>
/* layout from the original MenuMainMenu component */
.wrapper {
  position: fixed;
  right: var(--grid-margin);
  top: var(--grid-margin);
  z-index: 20;
}
</style>
