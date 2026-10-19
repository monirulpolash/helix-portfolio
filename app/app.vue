<script setup lang="ts">
// Same tree as the original: WebGL canvas + home overlay (header, menu, view switch,
// sound) stay mounted; pages swap underneath with their own transitions.
const content = useContentStore()
onMounted(() => { history.scrollRestoration = 'manual' })
</script>

<template>
  <ExperienceCanvas :projects="content.projects" />
  <HomeOverlay />
  <main>
    <NuxtPage />
  </main>
</template>
