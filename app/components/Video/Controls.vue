<script setup lang="ts">
// Same as the original VideoControls: a white pill at the bottom of the player with a
// play/pause button, a mute button (icons swap with "iconfade") and a 4-frame filmstrip
// (thumbnails at 20/40/60/80% of the video). A dark overlay slides across the strip as the
// video plays; clicking the strip seeks to that point.
import { videoSrc } from '~~/data/portfolio.js'

const props = defineProps<{
  isPlaying: boolean
  isMuted: boolean
  duration: number | null
  progress: number
  videoId: string
  setVideoTime: (pct: number) => void
}>()
const emit = defineEmits<{ 'toggle-play': []; 'toggle-mute': [] }>()

const thumbs = computed(() => (props.duration ? [20, 40, 60, 80].map((p) => videoSrc(props.videoId).thumb(p)) : []))
const remaining = computed(() => 1 - Math.min(Math.max(props.progress, 0), 1))
function seek(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  props.setVideoTime((e.clientX - r.left) / r.width)
}
</script>

<template>
  <div class="controls">
    <div class="inner">
      <button class="button" aria-label="Play or pause" @click="emit('toggle-play')">
        <div class="background" />
        <Transition name="iconfade">
          <IconsPauseIcon v-if="isPlaying" key="pause" class="absolute" />
          <IconsPlayIcon v-else key="play" />
        </Transition>
      </button>
      <button class="button" aria-label="Mute or unmute" @click="emit('toggle-mute')">
        <div class="background" />
        <Transition name="iconfade">
          <IconsSoundOffIcon v-if="isMuted" key="off" class="absolute" />
          <IconsSoundOnIcon v-else key="on" />
        </Transition>
      </button>
      <div class="progress-thumbs" @click="seek">
        <div v-for="(t, i) in thumbs" :key="i" class="thumb">
          <img :src="t" alt="Thumbnail image">
        </div>
        <div class="progress-overlay" :style="{ transform: `translateX(${100 - remaining * 100}%)` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>/* layout from the original VideoControls component */
.controls {
  bottom: 30rem;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  z-index: 50;
}
.controls,.controls .inner {
  align-items: center;
  display: flex;
}
.controls .inner {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  gap: 4rem;
  margin: 0 20rem;
  padding: var(--gap-xs);
  pointer-events: auto;
}
.controls .button {
  align-items: center;
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-size: 14rem;
  height: 48rem;
  justify-content: center;
  padding: 8rem 16rem;
  position: relative;
  width: 48rem;
}
.controls .button svg {
  position: relative;
}
.controls .button .absolute {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
.controls .button .background {
  background-color: var(--color-bg-dark);
  border-radius: var(--radius-full);
  height: 100%;
  position: absolute;
  transition: transform 0.15s ease-out;
  width: 100%;
}
.controls .button:hover .background {
  transform: scale(0.9);
}
.controls .progress-thumbs {
  border-radius: 10rem;
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-left: var(--gap-s);
  overflow: hidden;
  pointer-events: all;
  position: relative;
}
.controls .progress-thumbs .progress-overlay {
  background: var(--color-bg-dark60);
  border-left: 3px solid var(--color-white);
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  transform-origin: center right;
  transition: transform 0.4s ease;
  width: 100%;
}
.controls .progress-thumbs .thumb {
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.controls .progress-thumbs .thumb img {
  display: block;
  height: 48rem;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: auto;
}</style>
