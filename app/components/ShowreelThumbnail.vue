<script setup lang="ts">
// Same as the original ShowreelThumbnail: a tilted 16:9 card, bottom left, with
// "showreel • year" letters running around its rounded outline (CSS offset-path). Clicking it
// opens the full-screen VideoPlayer (written in piece 2) and fades the site sound out while
// it plays, then back in when it closes.
import { portfolio, videoSrc } from '~~/data/portfolio.js'

const { showreel } = useContentStore()
const open = ref(false)
const audio = useAudio()
const audioStore = useAudioStore()
const year = new Date().getFullYear()
const marquee = Array.from({ length: 5 }, () => `showreel • ${year} • `).join('').split('')
const thumb = computed(() => portfolio.showreel?.thumbnail || (showreel ? videoSrc(showreel.video).poster : ''))

function openPlayer() {
  open.value = true
  if (audioStore.enabled) audio.animateGlobalVolume(0, 500)
}
function closePlayer() {
  open.value = false
  if (audioStore.enabled) setTimeout(() => audio.animateGlobalVolume(1, 500), 500)
}
</script>

<template>
  <Transition v-if="showreel !== undefined" name="fade">
    <VideoPlayer v-if="open" :video="showreel" :thumbnail="thumb" @close="closePlayer" />
  </Transition>
  <div class="showreel-thumbnail">
    <div class="thumbnail-wrapper">
      <img class="thumbnail" :src="thumb" alt="Showreel Thumbnail" @click="openPlayer">
      <div class="marquee-container">
        <span v-for="(c, i) in marquee" :key="i" class="marquee-text" :style="{ animationDelay: `${i * 0.12}s` }">{{ c }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* layout from the original ShowreelThumbnail component */
.showreel-thumbnail {
  bottom: var(--grid-margin);
  left: var(--grid-margin);
  position: fixed;
  z-index: 10;
}
.showreel-thumbnail .thumbnail-wrapper {
  aspect-ratio: 16/9;
  box-shadow: 0 4px 8px #0003;
  height: auto;
  left: -140rem;
  position: absolute;
  top: -40rem;
  transform: rotate(-15deg);
  transition: transform 0.3s var(--ease-spring);
  width: 280rem;
}
.showreel-thumbnail .thumbnail-wrapper:hover {
  transform: rotate(-13deg) scale(1.05);
}
.showreel-thumbnail .thumbnail-wrapper .marquee-container {
  height: 100%;
  left: -12rem;
  pointer-events: none;
  position: absolute;
  top: -12rem;
  width: calc(100% + 200rem);
}
.showreel-thumbnail .thumbnail-wrapper svg {
  display: none;
  height: 100%;
  left: 0;
  opacity: 0.2;
  position: absolute;
  top: 0;
  width: 100%;
}
.showreel-thumbnail .thumbnail-wrapper .marquee-text {
  animation: moveAlong 12s linear infinite;
  font-size: 18rem;
  font-weight: 500;
  left: 0;
  offset-anchor: bottom;
  offset-path: path(
    "M29.5684 182H274.432C290.14 182 304 169 304 152.286V29.7143C304 13 291.064 0 274.432 0H29.5684C12.9362 0 0 13 0 29.7143V152.286C0 169 13.8602 182 29.5684 182Z"
  );
  offset-rotate: auto 180deg;
  position: absolute;
  top: 0;
}
.showreel-thumbnail .thumbnail-wrapper .thumbnail {
  border-radius: 20rem;
  cursor: pointer;
  display: block;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 100%;
}
</style>
