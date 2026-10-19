<script setup lang="ts">
// Same tree as the original HomeOverlay: logo, spiral/list switch (home only), menu,
// showreel thumbnail and sound button. Everything fades out away from / and /about.
const route = useRoute()
const visible = computed(() => route.path === '/' || route.path === '/about')
const isHome = computed(() => route.path === '/')
const { showreel } = useContentStore()
</script>

<template>
  <div class="home-overlay-wrapper" :class="{ hide: !visible }">
    <OthersHeaderLogo />
    <Transition name="fade">
      <ProjectViewSwitch v-if="isHome" />
    </Transition>
    <MenuMainMenu />
    <ShowreelThumbnail v-if="showreel" />
    <OthersSoundButton />
  </div>
</template>

<style scoped>
/* layout from the original HomeOverlay component */
.home-overlay-wrapper {
  transition: opacity 0.5s ease-out;
}
.home-overlay-wrapper.hide {
  opacity: 0;
}
.logo {
  height: 64rem;
  left: var(--grid-margin);
  position: fixed;
  top: var(--grid-margin);
  width: 64rem;
  z-index: 20;
}
</style>
