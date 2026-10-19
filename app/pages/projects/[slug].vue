<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

// Same as the original /projects/[slug] page: 404 for an unknown slug, title + description in
// the head, the ProjectCard, then ProjectNextProject for the following project. Opened directly
// (no loader on this page), it enters the experience as soon as the spiral is ready.
// Every slug is listed in nitro.prerender.routes, so direct links work on the static build.
definePageMeta({ pageTransition: projectPageTransition })

const route = useRoute()
const content = useContentStore()
const slug = computed(() => String(route.params.slug))
const project = computed(() => content.getProjectBySlug(slug.value))
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
const next = computed(() => content.getNextProject(slug.value))
const experience = useExperienceStore()

useHead(() => ({
  title: project.value ? `${project.value.title} ✲ ${portfolio.site.name}` : portfolio.site.name,
  meta: project.value ? [{ name: 'description', content: project.value.shortDescription }] : [],
}))

watch(() => experience.isReady, (ready) => {
  if (ready && experience.hasEntered === false) experience.setHasEntered()
}, { immediate: import.meta.client })
</script>

<template>
  <main>
    <ProjectCard v-if="project" :project="project" />
    <ProjectNextProject v-if="next" :project="next" />
  </main>
</template>
