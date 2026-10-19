<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'
import { MOTION } from '~/experience/config'

const { site, projects } = portfolio
const helix = useHelix()
const { $audio } = useNuxtApp()
const abs = useAbsoluteUrl()

useHead({ bodyAttrs: { class: 'is-home' } })
useSeoMeta({
  title: '',
  ogTitle: `${site.author} — ${site.role}`,
  description: site.description,
  ogDescription: site.description,
  ogImage: abs('/og/default.jpg'),
})

const percent = computed(() => Math.round(helix.progress * 100))
const hoveredIndex = computed(() => {
  const p = helix.hovered
  return p ? projects.findIndex((x) => x.slug === p.slug) : -1
})
const pad = (n: number) => String(n).padStart(2, '0')

function enter(withSound: boolean) {
  helix.entered = true
  $audio.start(withSound).then(() => $audio.play('click'))
  if (helix.mode === 'spiral') {
    helix.experience?.setActive(true)
    helix.experience?.reveal(MOTION.enterDelay)
  }
}

function setMode(mode: 'spiral' | 'list') {
  if (helix.mode === mode || (mode === 'spiral' && helix.failed)) return
  helix.mode = mode
  $audio.play('switch')
  const exp = helix.experience
  if (!exp) return
  if (mode === 'list') {
    exp.hide()
    exp.setActive(false)
  } else {
    exp.setActive(true)
    exp.reveal(MOTION.enterDelay)
  }
}

const { $router } = useNuxtApp()
function openFromList(slug: string) {
  $audio.play('open')
  $router.push(`/projects/${slug}`)
}
</script>

<template>
  <main class="home" :class="`mode-${helix.mode}`">
    <h1 class="sr-only">{{ site.author }} — selected work</h1>

    <!-- Intro / loader -->
    <Transition name="loader">
      <section v-if="!helix.entered" class="loader" aria-live="polite">
        <div class="loader-top">
          <p class="loader-name">{{ site.author }}</p>
          <p class="loader-role">{{ site.role }}</p>
        </div>
        <div class="loader-bottom">
          <p class="loader-count" :aria-label="`Loading ${percent} percent`">
            {{ String(percent).padStart(3, '0') }}<span>%</span>
          </p>
          <div class="loader-actions" :class="{ 'is-ready': helix.ready }">
            <button type="button" class="pill pill-solid" :disabled="!helix.ready" @click="enter(true)">
              Enter
            </button>
            <button type="button" class="link-quiet" :disabled="!helix.ready" @click="enter(false)">
              Enter without sound
            </button>
          </div>
        </div>
        <div class="loader-bar" :style="{ transform: `scaleX(${helix.progress})` }" />
      </section>
    </Transition>

    <!-- Hover label -->
    <div class="hover-label" :class="{ 'is-on': helix.hovered && helix.mode === 'spiral' }" aria-hidden="true">
      <span class="hover-index">{{ hoveredIndex >= 0 ? pad(hoveredIndex + 1) : '00' }} / {{ pad(projects.length) }}</span>
      <span class="hover-title">{{ helix.hovered?.title }}</span>
      <span class="hover-year">{{ helix.hovered?.year }}</span>
    </div>

    <p v-if="helix.mode === 'spiral'" class="hint" aria-hidden="true">
      <span class="hint-desktop">Scroll to turn · Click a project</span>
      <span class="hint-touch">Swipe to turn · Tap a project</span>
    </p>

    <!-- Spiral / list switch -->
    <div v-if="!helix.failed" class="mode-switch" role="group" aria-label="View">
      <button type="button" :aria-pressed="helix.mode === 'spiral'" @click="setMode('spiral')">Spiral</button>
      <button type="button" :aria-pressed="helix.mode === 'list'" @click="setMode('list')">List</button>
    </div>

    <!-- The list: visible in list mode, and always in the HTML for search engines and screen readers -->
    <nav class="project-list" aria-label="Projects">
      <ol>
        <li v-for="(p, i) in projects" :key="p.slug" :style="{ '--i': i }">
          <NuxtLink :to="`/projects/${p.slug}`" @click.prevent="openFromList(p.slug)">
            <span class="list-index">{{ pad(i + 1) }}</span>
            <span class="list-title">{{ p.title }}</span>
            <span class="list-tags">{{ p.tags.join(', ') }}</span>
            <span class="list-year">{{ p.year }}</span>
            <img class="list-thumb" :src="p.image" alt="" loading="lazy" decoding="async">
          </NuxtLink>
        </li>
      </ol>
    </nav>
  </main>
</template>

<style scoped>
.home {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.home > * {
  pointer-events: auto;
}

/* Loader */
.loader {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) + env(safe-area-inset-bottom));
}
.loader-name {
  font-size: clamp(2.2rem, 7vw, 6rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.95;
}
.loader-role {
  margin-top: 0.75rem;
  opacity: 0.6;
}
.loader-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.loader-count {
  font-size: clamp(4rem, 16vw, 12rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.8;
  font-variant-numeric: tabular-nums;
}
.loader-count span {
  font-size: 0.3em;
  margin-left: 0.1em;
  vertical-align: top;
}
.loader-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}
.loader-actions.is-ready {
  opacity: 1;
  transform: none;
}
.loader-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--fg);
  transform-origin: left;
  transition: transform 0.4s var(--ease);
}
.loader-leave-active {
  transition: opacity 0.8s var(--ease), clip-path 0.9s var(--ease);
}
.loader-leave-to {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
}

/* Hover label */
.hover-label {
  position: fixed;
  left: var(--gutter);
  bottom: calc(var(--gutter) + env(safe-area-inset-bottom));
  display: grid;
  gap: 0.25rem;
  pointer-events: none;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.hover-label.is-on {
  opacity: 1;
  transform: none;
}
.hover-index,
.hover-year {
  font-size: 0.8rem;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
.hover-title {
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hint {
  position: fixed;
  left: 50%;
  bottom: calc(var(--gutter) + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  font-size: 0.8rem;
  opacity: 0.5;
  white-space: nowrap;
  pointer-events: none;
}
.hint-touch { display: none; }
@media (hover: none) {
  .hint-desktop { display: none; }
  .hint-touch { display: inline; }
}

.mode-switch {
  position: fixed;
  right: var(--gutter);
  bottom: calc(var(--gutter) + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}
.mode-switch button {
  font: inherit;
  font-size: 0.85rem;
  color: var(--fg);
  background: none;
  border: 0;
  border-radius: 99px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  opacity: 0.6;
  transition: background 0.3s, color 0.3s, opacity 0.3s;
}
.mode-switch button[aria-pressed='true'] {
  background: var(--fg);
  color: var(--bg);
  opacity: 1;
}

/* List */
.project-list {
  position: fixed;
  inset: 0;
  z-index: 5;
  overflow-y: auto;
  padding: calc(var(--gutter) * 5) var(--gutter) calc(var(--gutter) * 5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s var(--ease), visibility 0s linear 0.5s;
}
.mode-list .project-list {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.5s var(--ease) 0.2s, visibility 0s;
}
.project-list ol {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 1200px;
}
.project-list li {
  border-top: 1px solid var(--line);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
  transition-delay: calc(var(--i) * 40ms + 200ms);
}
.mode-list .project-list li {
  opacity: 1;
  transform: none;
}
.project-list li:last-child {
  border-bottom: 1px solid var(--line);
}
.project-list a {
  position: relative;
  display: grid;
  grid-template-columns: 3rem 1fr auto 4rem;
  align-items: baseline;
  gap: 1rem;
  padding: 1.1rem 0;
}
.list-index,
.list-year,
.list-tags {
  font-size: 0.85rem;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}
.list-year { text-align: right; }
.list-title {
  font-size: clamp(1.6rem, 4vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
  transition: transform 0.4s var(--ease);
}
.list-thumb {
  position: absolute;
  right: 6rem;
  top: 50%;
  width: 220px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-50%) scale(0.92) rotate(-2deg);
  transition: opacity 0.35s var(--ease), transform 0.5s var(--ease);
}
@media (hover: hover) {
  .project-list a:hover .list-title { transform: translateX(0.5rem); }
  .project-list a:hover .list-thumb {
    opacity: 1;
    transform: translateY(-50%) scale(1) rotate(0);
  }
}
@media (max-width: 700px) {
  .project-list a {
    grid-template-columns: 2.2rem 1fr auto;
  }
  .list-tags,
  .list-thumb { display: none; }
  .hover-label { bottom: calc(var(--gutter) * 3.5 + env(safe-area-inset-bottom)); }
  .hint { display: none; }
}
</style>
