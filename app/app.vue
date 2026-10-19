<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

const abs = useAbsoluteUrl()
const route = useRoute()
const { site } = portfolio

// Site-wide defaults. Each page overrides title, description and image.
useHead({
  titleTemplate: (title) => (title ? `${title} — ${site.author}` : `${site.author} — ${site.role}`),
  link: [{ rel: 'canonical', href: () => abs(route.path) }],
})
useSeoMeta({
  description: site.description,
  ogSiteName: site.name,
  ogType: 'website',
  ogUrl: () => abs(route.path),
  ogImage: abs('/og/default.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="app">
    <ExperienceCanvas />
    <SiteHeader />
    <NuxtPage />
  </div>
</template>
