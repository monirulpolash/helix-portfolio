<script setup lang="ts">
// Same tree as the original index page: the loader, the list view, and (with a mouse only)
// the bottom hover label that names the spiral card under the cursor.
// ProjectList and ProjectHover are written in piece 2.
definePageMeta({
  pageTransition: basicPageTransition,
  // back from a project or the about page in spiral mode: the cards fly back in
  middleware(_to, from) {
    if ((from.fullPath.includes('/projects') || from.fullPath.includes('/about')) && useHomeViewStore().mode === 'spiral') {
      setTimeout(() => useExperienceStore().experience?.world?.revealProjects(), 300)
    }
  },
})

const { hover } = useBreakpoint()
</script>

<template>
  <main>
    <Loader />
    <ProjectList />
    <ClientOnly>
      <ProjectHover v-if="hover" />
    </ClientOnly>
  </main>
</template>

<style scoped>
/* layout from the original PageIndex component */
main {
  display: flex;
  flex-direction: column;
  gap: var(--grid-margin);
  width: 100%;
}
</style>
