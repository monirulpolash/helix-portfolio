<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

// Same as the original about page: AboutTextSection (scroll-lit text), AboutCarousel (project
// marquee), AboutSocials (links + sticker trail + credits). Opened directly, it enters the
// experience as soon as the spiral is ready, and Lenis re-measures the page on mount.
definePageMeta({
  pageTransition: basicPageTransition,
  // coming from the home page: the spiral cards fold away behind the about page
  middleware(_to, from) {
    if (from.fullPath === '/') useExperienceStore().experience?.world?.hideProjects()
  },
})

const experience = useExperienceStore()
useHead({ title: `about ✲ ${portfolio.site.name}` })

watch(() => experience.isReady, (ready) => {
  if (ready && experience.hasEntered === false) experience.setHasEntered()
}, { immediate: import.meta.client })

onMounted(() => {
  ;(useNuxtApp().$lenis as { resize?: () => void } | undefined)?.resize?.()
})
</script>

<template>
  <main>
    <AboutTextSection />
    <AboutCarousel />
    <AboutSocials />
  </main>
</template>

<style scoped>/* layout from the original PageAbout component */
main {
  width: 100%;
}</style>
