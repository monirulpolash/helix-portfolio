<script setup lang="ts">
import type { Project } from '~/composables/stores'

// Same as the original ProjectCard: the white rounded card of the project page (#project-infos)
// with a round close button (plays "close" and goes home), the VideoPreview at the top (or the
// thumbnail when a project has no video), ProjectInfos, then ProjectStyleframes.
const props = defineProps<{ project: Project }>()
const audio = useAudio()
function close(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  audio.play('close')
  navigateTo('/')
}
</script>

<template>
  <div id="project-infos" class="wrapper">
    <button class="close" aria-label="Close the panel" @click="close">
      <IconsCrossIcon />
    </button>
    <VideoPreview v-if="props.project.video" :video="props.project.video" />
    <img v-else :src="props.project.thumbnail" :alt="props.project.title">
    <ProjectInfos :project="props.project" />
    <ProjectStyleframes v-if="props.project.styleframes?.length" :styleframes="props.project.styleframes" />
  </div>
</template>

<style scoped>/* layout from the original ProjectCard component */
.wrapper {
  align-items: start;
  background-color: var(--color-white);
  border-radius: 16rem;
  color: var(--color-bg-dark);
  display: flex;
  flex-direction: column;
  margin: var(--grid-margin);
  overflow: hidden;
  position: relative;
  width: calc(var(--grid-column) * 12 + var(--grid-gutter) * 11);
  z-index: 10;
}
.wrapper img {
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 100%;
}

@media screen and (max-width: 900px) {.wrapper {
    width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
  }

}
.close {
  align-items: center;
  background: transparent;
  background-color: var(--color-bg-dark);
  border-radius: 50%;
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  height: 48rem;
  justify-content: center;
  pointer-events: auto;
  position: absolute;
  right: 10rem;
  top: 10rem;
  width: 48rem;
  z-index: 50;
}
.close svg {
  transition: transform 0.2s ease;
}
.close:hover svg {
  transform: rotate(90deg);
}</style>
