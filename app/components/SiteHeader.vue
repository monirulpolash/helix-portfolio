<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

const { $audio } = useNuxtApp()
const route = useRoute()
const muted = computed(() => $audio.muted.value)
const onProject = computed(() => route.path.startsWith('/projects/'))
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="logo" aria-label="Home">
      <span class="logo-mark" aria-hidden="true" />
      <span>{{ portfolio.site.author }}</span>
    </NuxtLink>

    <nav class="nav" aria-label="Main">
      <NuxtLink to="/" :class="{ 'is-active': route.path === '/' || onProject }">Work</NuxtLink>
      <NuxtLink to="/about" :class="{ 'is-active': route.path === '/about' }">About</NuxtLink>
      <button
        type="button"
        class="sound"
        :class="{ 'is-muted': muted }"
        :aria-pressed="!muted"
        :aria-label="muted ? 'Turn sound on' : 'Turn sound off'"
        @click="$audio.toggle()"
      >
        <span class="bars" aria-hidden="true"><i /><i /><i /><i /></span>
        <span class="sound-label">{{ muted ? 'Sound off' : 'Sound on' }}</span>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--gutter) + env(safe-area-inset-top)) var(--gutter) var(--gutter);
  pointer-events: none;
  mix-blend-mode: difference;
}
.site-header a,
.site-header button {
  pointer-events: auto;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.logo-mark {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  position: relative;
}
.logo-mark::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  background: currentColor;
  transform: scale(0.4);
  transition: transform 0.4s var(--ease);
}
.logo:hover .logo-mark::after {
  transform: scale(1);
}
.nav {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.25rem);
}
.nav a {
  position: relative;
  opacity: 0.6;
  transition: opacity 0.3s;
}
.nav a:hover,
.nav a.is-active {
  opacity: 1;
}
.nav a.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: currentColor;
}
.sound {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}
.bars i {
  display: block;
  width: 2px;
  height: 100%;
  background: currentColor;
  transform-origin: bottom;
  animation: bar 1s ease-in-out infinite alternate;
}
.bars i:nth-child(2) { animation-delay: -0.3s; }
.bars i:nth-child(3) { animation-delay: -0.6s; }
.bars i:nth-child(4) { animation-delay: -0.9s; }
.is-muted .bars i {
  animation: none;
  transform: scaleY(0.2);
}
@keyframes bar {
  from { transform: scaleY(0.25); }
  to { transform: scaleY(1); }
}
@media (max-width: 600px) {
  .sound-label {
    display: none;
  }
}
</style>
