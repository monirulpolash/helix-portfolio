<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '~/composables/stores'

// Same as the original ProjectNextProject: a sticky full-height block under the project card
// with a "back to home" link, the next project's 16:9 image (scrubbed 0.9 -> 1 scale while the
// card scrolls away) and two tags that pop in with an elastic ease ("next up..." at 50%,
// "keep scrolling !" at 20%), the title below, and the wheel progress bar on desktop.
const props = defineProps<{ project: Project }>()
const imageElement = ref<HTMLImageElement | null>(null)
const topTag = ref<HTMLElement | null>(null)
const bottomTag = ref<HTMLElement | null>(null)
const imageHeight = ref(0)
const router = useRouter()
const audio = useAudio()
const { tabletPortrait, touch } = useBreakpoint()
const path = computed(() => `/projects/${props.project.slug}`)
let ctx: gsap.Context | null = null
let ro: ResizeObserver | null = null

function popTag(el: HTMLElement | null, trigger: HTMLElement, start: string) {
  if (!el) return
  gsap.set(el, { scale: 0.8, opacity: 0 })
  const show = gsap.to(el, { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)', paused: true })
  const hide = gsap.to(el, { scale: 0.8, opacity: 0, duration: 0.25, ease: 'power2.inOut', paused: true })
  ScrollTrigger.create({ trigger, start, onEnter: () => show.restart(), onLeaveBack: () => hide.restart() })
}
function go(to: string) {
  audio.play('longclick')
  router.push(to)
}
const measure = () => { imageHeight.value = imageElement.value?.offsetHeight || 0 }

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  measure()
  imageElement.value?.addEventListener('load', measure)
  window.addEventListener('resize', measure)
  if (imageElement.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(measure)
    ro.observe(imageElement.value)
  }
  const card = document.getElementById('project-infos')
  if (!card) return
  ctx = gsap.context(() => {
    gsap.fromTo(imageElement.value, { scale: 0.9, opacity: 0.5 }, {
      scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'bottom 75%', end: 'bottom top', scrub: true },
    })
    popTag(bottomTag.value, card, 'bottom 50%')
    popTag(topTag.value, card, 'bottom 20%')
  })
})
onBeforeUnmount(() => {
  ro?.disconnect()
  imageElement.value?.removeEventListener('load', measure)
  window.removeEventListener('resize', measure)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <div class="next-project">
    <NuxtLink to="/" class="back-link">back to home</NuxtLink>
    <div class="image-container">
      <img ref="imageElement" :src="props.project.thumbnail" :alt="props.project.title" @click="go(path)">
      <div ref="topTag" class="tag green top-right">keep scrolling !</div>
      <div ref="bottomTag" class="tag bottom-left">next up...</div>
      <h4>{{ props.project.title }}</h4>
    </div>
    <ProjectNextProjectProgressBar v-if="!touch && !tabletPortrait" :height="imageHeight" :path="path" />
  </div>
</template>

<style scoped>/* layout from the original ProjectNextProject component */
.next-project {
  align-items: center;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--gap-l);
  height: 100vh;
  justify-content: center;
  padding: var(--grid-margin);
  position: sticky;
  width: 100%;
}
.next-project .back-link {
  color: var(--color-white);
  cursor: pointer;
  font-size: 14rem;
  font-weight: 400;
  opacity: 0.7;
  position: absolute;
  top: var(--grid-margin);
}
.next-project .back-link:before {
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
.next-project .back-link:hover:before {
  transform: scaleX(1);
  transform-origin: left;
}
.next-project img {
  aspect-ratio: 16/9;
  border-radius: 12rem;
  cursor: pointer;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
}
.next-project h4 {
  bottom: -60rem;
  color: var(--color-white);
  font-size: 24rem;
  font-weight: 500;
  left: 50%;
  position: absolute;
  text-align: center;
  transform: translate(-50%);
}

@media screen and (max-width: 900px) {.next-project h4 {
    bottom: -45rem;
    font-size: 18rem;
    width: 100%;
  }

}
.image-container {
  position: relative;
}
.image-container .tag {
  background-color: var(--color-white);
  border-radius: 50rem;
  color: var(--color-bg-dark);
  font-size: 24rem;
  font-weight: 500;
  padding: 8rem 16rem;
  position: absolute;
}
.image-container .tag.green {
  background-color: var(--color-pop-green);
}
.image-container .tag.top-right {
  right: -60rem;
  rotate: -8deg;
  top: -20rem;
}

@media screen and (max-width: 900px) {.image-container .tag.top-right {
    display: none;
  }

}
.image-container .tag.bottom-left {
  bottom: -20rem;
  left: -60rem;
  rotate: 9deg;
}

@media screen and (max-width: 900px) {.image-container .tag.bottom-left {
    background-color: var(--color-pop-green);
    bottom: unset;
    font-size: 18rem;
    left: -5rem;
    rotate: -8deg;
    top: -10rem;
  }

}</style>
