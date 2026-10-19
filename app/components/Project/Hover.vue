<script setup lang="ts">
// Same as the original ProjectHover: the bottom-centre label (white pill with a 48px
// thumbnail and the project title) that appears while the mouse is over a spiral card and
// fades with "project-fade". The original listens to the experience's "hoverProject" event;
// here Experience.ts calls hooks.hover(project | null), which sets
// useExperienceStore().hoveredProject. Mouse devices only (pages/index.vue checks hover).
const experienceStore = useExperienceStore()
const project = computed(() => experienceStore.hoveredProject)
onBeforeUnmount(() => { experienceStore.hoveredProject = null })
</script>

<template>
  <Transition name="project-fade">
    <div v-if="project" class="wrapper">
      <div class="content">
        <div class="infos">
          <img :src="project.thumbnail" :alt="`${project.title} thumbnail image`">
          <h4>{{ project.title }}</h4>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>/* layout from the original ProjectHover component */
.wrapper {
  bottom: 60rem;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  z-index: 10;
}
.wrapper,.wrapper .content {
  align-items: center;
  display: flex;
}
.wrapper .content {
  background: var(--color-white);
  border-radius: 14rem;
  color: var(--color-bg-dark);
  gap: 20rem;
  justify-content: space-between;
  max-width: calc(var(--grid-column) * 4 + var(--grid-gutter) * 3);
  padding: 6rem 16rem 6rem 6rem;
}
.wrapper .infos {
  align-items: center;
  display: flex;
  gap: 12rem;
  overflow: hidden;
}
.wrapper .infos img {
  background-color: var(--color-bg-dark);
  border-radius: 9rem;
  height: 48rem;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 48rem;
}
.wrapper .infos h4 {
  font-size: 18rem;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}</style>
