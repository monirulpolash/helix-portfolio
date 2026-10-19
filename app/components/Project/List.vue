<script setup lang="ts">
// Same as the original ProjectList: the "list" view of the home page. When homeView.mode is
// "list" the project titles drop in one by one (GSAP, stagger 0.05) and leave the same way
// when you switch back to the spiral. Hovering a title plays the hover sound, dims the other
// titles (CSS :has) and, with a mouse, shows the cursor-following thumbnail (UiCursorImage).
// Clicking a title plays "longclick" and opens /projects/<slug>.
import gsap from 'gsap'
import type { Project } from '~/composables/stores'

const { projects } = useContentStore()
const homeView = useHomeViewStore()
const audio = useAudio()
const nuxt = useNuxtApp()
const { hover } = useBreakpoint()
const wrapperRef = ref<HTMLElement | null>(null)
const hovered = ref<Project | null>(null)
const lenis = () => (nuxt.$lenis as { resize?: () => void } | undefined)

function onEnterProject(p: Project) {
  audio.play('hover')
  hovered.value = p
}
function onLeaveProject() { hovered.value = null }

function enter(el: Element, done: () => void, delay?: number) {
  const items = (el as HTMLElement).querySelectorAll('.project')
  gsap.fromTo(items, { y: -30, opacity: 0, scaleY: 0.5 }, {
    y: 0, opacity: 1, duration: 0.5, scaleY: 1, ease: 'power3.out', stagger: 0.05, delay: delay ?? 0.2,
    onComplete: () => { lenis()?.resize?.(); done() },
  })
}
function leave(el: Element, done: () => void) {
  const items = (el as HTMLElement).querySelectorAll('.project')
  gsap.fromTo(items, { y: 0, opacity: 1 }, {
    y: 50, opacity: 0, scaleY: 0.5, duration: 0.3, ease: 'power3.out', stagger: 0.05, onComplete: done,
  })
}

onMounted(() => {
  lenis()?.resize?.()
  if (wrapperRef.value) enter(wrapperRef.value, () => {}, 0)
})
</script>

<template>
  <Transition :css="false" @enter="enter" @leave="leave">
    <div v-if="homeView.mode === 'list'" ref="wrapperRef" class="wrapper">
      <UiCursorImage v-if="hover" :project="hovered" />
      <div
        v-for="p in projects"
        :key="p.slug"
        class="project"
        @mouseenter="onEnterProject(p)"
        @mouseleave="onLeaveProject"
      >
        <p>
          <NuxtLink :to="`/projects/${p.slug}`" @click="audio.play('longclick')">{{ p.title }}</NuxtLink>
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>/* layout from the original ProjectList component */
.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: calc(
    var(--grid-column) * 0 + var(--grid-gutter) * 0 + var(--grid-margin) * 1
  );
  min-height: 100vh;
  overflow-x: hidden;
  padding-block: calc(20vh - 60rem);
  position: relative;
  text-align: center;
  width: calc(var(--grid-column) * 12 + var(--grid-gutter) * 11);
}
.wrapper .project p {
  cursor: pointer;
  font-size: 60rem;
  font-weight: 500;
  margin: 0;
  padding: calc(var(--grid-gutter) / 2) 0;
  pointer-events: auto;
  position: relative;
  transform-origin: top center;
  transition: opacity 0.3s ease;
  z-index: 10;
}

@media screen and (hover: hover) and (pointer: fine) {.wrapper .project p:hover {
    opacity: 1;
    transition: none;
  }

}

@media screen and (max-width: 900px) {.wrapper .project p {
    font-size: 40rem;
  }

}

@media screen and (hover: hover) and (pointer: fine) {.wrapper:has(.project p:hover) .project p:not(:hover) {
    opacity: 0.4;
  }

}

@media screen and (max-width: 900px) {.wrapper {
    height: 100%;
    min-height: unset;
    padding-top: 20vh;
    width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
  }

}</style>
