<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

// Same as the original AboutSocials: a full-height block of big lowercase social links (hover
// sound, the others dim to 0.4), the sticker AboutImageTrail behind them with a mouse, and a
// credits line at the bottom on desktop. Links and credits come from data/portfolio.js.
const { socialLinks } = useContentStore()
const audio = useAudio()
const { hover } = useBreakpoint()
const credits = portfolio.credits
const names: Record<string, string> = { instagram: 'instagram', linkedin: 'linkedin', behance: 'behance', twitter: 'twitter' }
const label = (s: { platform: string; label?: string }) => s.label || names[s.platform] || s.platform
</script>

<template>
  <div class="wrapper">
    <ClientOnly>
      <AboutImageTrail v-if="hover" />
    </ClientOnly>
    <div class="socials">
      <a
        v-for="(s, i) in socialLinks" :key="i" :href="s.url" target="_blank" rel="noopener noreferrer"
        class="social-link" :aria-label="label(s)" @mouseenter="audio.play('hover')"
      >{{ label(s) }}</a>
    </div>
    <p class="credits">
      <template v-for="(c, i) in credits" :key="i">
        {{ i ? ' | ' : '' }}{{ c.role }} <a :href="c.url" target="_blank" rel="noopener noreferrer">{{ c.name }}</a>
      </template>
    </p>
  </div>
</template>

<style scoped>/* layout from the original AboutSocials component */
.wrapper {
  min-height: 100vh;
  padding: var(--grid-margin);
  pointer-events: none;
}
.wrapper,.wrapper .socials {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
}
.wrapper .socials {
  flex-direction: column;
  text-align: center;
}
.wrapper .socials .social-link {
  color: var(--color-text-light);
  font-size: 64rem;
  font-weight: 500;
  padding-block: 6rem;
  pointer-events: all;
  text-decoration: none;
  text-transform: lowercase;
  transition: color 0.3s ease;
  transition: opacity 0.3s ease;
}

@media screen and (hover: hover) and (pointer: fine) {.wrapper .socials .social-link:hover {
    opacity: 1;
    transition: none;
  }

}
.wrapper .socials .social-link:first-child {
  padding-top: 0;
}
.wrapper .socials .social-link:last-child {
  padding-bottom: 0;
}

@media screen and (hover: hover) and (pointer: fine) {.wrapper .socials .social-link:hover {
    color: var(--color-accent);
  }

}

@media screen and (hover: hover) and (pointer: fine) {.wrapper
    .socials:has(.social-link:hover)
    .social-link:not(:hover) {
    opacity: 0.4;
  }

}
.wrapper .credits {
  bottom: 16rem;
  font-size: 14rem;
  opacity: 0.6;
  position: absolute;
  text-align: center;
  width: 100%;
}
.wrapper .credits a {
  color: var(--color-accent);
  pointer-events: all;
  position: relative;
  text-decoration: none;
  text-underline-offset: 4rem;
}
.wrapper .credits a:before {
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
.wrapper .credits a:hover:before {
  transform: scaleX(1);
  transform-origin: left;
}

@media screen and (max-width: 900px) {.wrapper .credits {
    display: none;
  }

}</style>