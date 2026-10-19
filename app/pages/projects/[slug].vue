<script setup lang="ts">
import { getNextProject, getProject, portfolio } from '~~/data/portfolio.js'

// This page is prerendered for every project, so a shared /projects/<slug> link opens straight away.
const route = useRoute()
const abs = useAbsoluteUrl()
const { $audio } = useNuxtApp()

const slug = computed(() => String(route.params.slug))
const project = computed(() => getProject(slug.value))
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}
const next = computed(() => getNextProject(slug.value))
const index = computed(() => portfolio.projects.findIndex((p) => p.slug === slug.value))
const pad = (n: number) => String(n).padStart(2, '0')

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.summary,
  ogTitle: () => `${project.value?.title} — ${portfolio.site.author}`,
  ogDescription: () => project.value?.summary,
  ogType: 'article',
  ogImage: () => abs(`/og/${slug.value}.jpg`),
  ogImageAlt: () => project.value?.title,
  twitterTitle: () => project.value?.title,
  twitterDescription: () => project.value?.summary,
  twitterImage: () => abs(`/og/${slug.value}.jpg`),
})

function close() {
  $audio.play('close')
  navigateTo('/')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <main v-if="project" class="project">
    <button type="button" class="close" aria-label="Close project" @click="close">
      <span aria-hidden="true" />
      <span class="close-label">Close</span>
    </button>

    <header class="project-head">
      <p class="eyebrow">{{ pad(index + 1) }} / {{ pad(portfolio.projects.length) }}</p>
      <h1 class="project-title">{{ project.title }}</h1>
      <dl class="meta">
        <div><dt>Year</dt><dd>{{ project.year }}</dd></div>
        <div><dt>Role</dt><dd>{{ project.role }}</dd></div>
        <div><dt>Client</dt><dd>{{ project.client }}</dd></div>
        <div><dt>Tags</dt><dd>{{ project.tags.join(', ') }}</dd></div>
      </dl>
    </header>

    <figure class="hero">
      <img :src="project.image" :alt="project.title" width="1600" height="900" fetchpriority="high">
    </figure>

    <section class="body">
      <p class="summary">{{ project.summary }}</p>
      <div class="text">
        <p v-for="(para, i) in project.description" :key="i">{{ para }}</p>
        <a v-if="project.link" :href="project.link" class="pill" target="_blank" rel="noopener">Visit the project</a>
      </div>
    </section>

    <section class="gallery">
      <figure v-for="(src, i) in project.gallery" :key="src" :class="`g-${i % 3}`">
        <img :src="src" :alt="`${project.title}, image ${i + 2}`" width="1600" height="900" loading="lazy" decoding="async">
      </figure>
    </section>

    <NextProject v-if="next && next.slug !== project.slug" :project="next" />
  </main>
</template>

<style scoped>
.project {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  background: var(--bg);
  padding: calc(var(--gutter) * 5) var(--gutter) 0;
}
.close {
  position: fixed;
  top: calc(var(--gutter) * 3.2 + env(safe-area-inset-top));
  right: var(--gutter);
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font: inherit;
  color: var(--fg);
  background: rgba(68, 68, 68, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: 99px;
  padding: 0.45rem 0.9rem 0.45rem 0.6rem;
  cursor: pointer;
}
.close span:first-child {
  position: relative;
  width: 14px;
  height: 14px;
}
.close span:first-child::before,
.close span:first-child::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1.5px;
  background: currentColor;
  transform: rotate(45deg);
  transition: transform 0.4s var(--ease);
}
.close span:first-child::after { transform: rotate(-45deg); }
.close:hover span:first-child::before { transform: rotate(135deg); }
.close:hover span:first-child::after { transform: rotate(45deg); }

.project-head {
  max-width: 1400px;
  margin: 0 auto;
}
.project-title {
  margin: 0.5rem 0 2.5rem;
  font-size: clamp(3rem, 12vw, 11rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.85;
  animation: rise 1s var(--ease) both;
}
.meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 1rem 0;
  border-top: 1px solid var(--line);
  animation: rise 1s var(--ease) 0.1s both;
}
.meta dt {
  font-size: 0.75rem;
  opacity: 0.55;
  margin-bottom: 0.2rem;
}
.meta dd { margin: 0; }

.hero {
  max-width: 1400px;
  margin: 2rem auto 0;
  border-radius: 10px;
  overflow: hidden;
  animation: reveal 1.2s var(--ease) 0.15s both;
}
.hero img,
.gallery img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.body {
  max-width: 1400px;
  margin: clamp(3rem, 10vw, 8rem) auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 5vw, 5rem);
}
.summary {
  font-size: clamp(1.4rem, 2.6vw, 2.2rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.text p {
  margin: 0 0 1.2rem;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 60ch;
}

.gallery {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
}
.gallery figure {
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
}
.gallery .g-0 { grid-column: 1 / span 7; }
.gallery .g-1 { grid-column: 6 / span 7; margin-top: 30%; }
.gallery .g-2 { grid-column: 2 / span 10; }

@keyframes rise {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
@keyframes reveal {
  from { clip-path: inset(18% 12% 18% 12% round 24px); transform: scale(1.04); opacity: 0.2; }
  to { clip-path: inset(0 0 0 0 round 10px); transform: none; opacity: 1; }
}

@media (max-width: 800px) {
  .meta { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .body { grid-template-columns: 1fr; }
  .gallery { grid-template-columns: 1fr; }
  .gallery figure { grid-column: 1 / -1 !important; margin-top: 0 !important; }
  .close-label { display: none; }
  .close { padding: 0.6rem; }
}
</style>
