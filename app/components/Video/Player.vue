<script setup lang="ts">
// Same as the original VideoPlayer: a full-screen layer (blurred poster behind) that plays
// the HLS video with autoplay + loop at volume 0.6. Clicking the video or pressing Escape
// closes it; a "close" UiCursorTag follows the mouse over the video; on phones a round close
// button sits top right. The VideoControls pill appears once the metadata has loaded.
// Used by ShowreelThumbnail (home) and VideoPreview (project page).
import type Hls from 'hls.js'
import { videoSrc } from '~~/data/portfolio.js'
import { attachHls } from '~/composables/useHlsVideo'

const props = defineProps<{ video: { video: string } | string; thumbnail?: string }>()
const emit = defineEmits<{ close: [] }>()

const videoId = computed(() => (typeof props.video === 'string' ? props.video : props.video.video))
const src = videoSrc(videoId.value)
const poster = computed(() => props.thumbnail || src.poster)

const playerWrapper = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const duration = ref<number | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const isReady = ref(false)
const progress = ref(0)
let hls: Hls | null = null

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused) { v.play(); isPlaying.value = true } else { v.pause(); isPlaying.value = false }
}
function toggleMute() {
  const v = videoRef.value
  if (!v) return
  v.muted = !v.muted
  isMuted.value = v.muted
}
function setVideoTime(pct: number) {
  if (!videoRef.value || !duration.value) return
  videoRef.value.currentTime = pct * duration.value
  progress.value = pct
}
const onPlay = () => { isPlaying.value = true }
const onPause = () => { isPlaying.value = false }
const onMeta = () => { isReady.value = true; if (videoRef.value) duration.value = videoRef.value.duration }
const onTime = () => { if (videoRef.value && duration.value) progress.value = videoRef.value.currentTime / duration.value }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close') }

onMounted(() => {
  window.addEventListener('keydown', onKey)
  const v = videoRef.value
  if (!v) return
  v.volume = 0.6
  v.addEventListener('play', onPlay)
  v.addEventListener('pause', onPause)
  v.addEventListener('loadedmetadata', onMeta)
  v.addEventListener('timeupdate', onTime)
  hls = attachHls(v, src.hls)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  hls?.destroy()
  const v = videoRef.value
  if (!v) return
  v.removeEventListener('play', onPlay)
  v.removeEventListener('pause', onPause)
  v.removeEventListener('loadedmetadata', onMeta)
  v.removeEventListener('timeupdate', onTime)
})
</script>

<template>
  <div class="player-wrapper" :style="`background-image: url(${poster})`">
    <div ref="playerWrapper" class="video-container">
      <video
        ref="videoRef"
        playsinline
        autoplay
        loop
        disablepictureinpicture
        class="video-element"
        :poster="poster"
        @click="emit('close')"
      />
      <UiCursorTag :wrapper="playerWrapper" label="close" />
    </div>
    <Transition name="project-fade">
      <VideoControls
        v-if="isReady"
        :is-playing="isPlaying"
        :is-muted="isMuted"
        :duration="duration"
        :progress="progress"
        :video-id="videoId"
        :set-video-time="setVideoTime"
        @toggle-play="togglePlay"
        @toggle-mute="toggleMute"
      />
    </Transition>
    <button class="mobileclose" aria-label="Close video" @click="emit('close')"><IconsCrossIcon /></button>
  </div>
</template>

<style scoped>/* layout from the original VideoPlayer component */
.player-wrapper {
  background-color: var(--color-bg-dark);
  background-position: 50%;
  background-size: cover;
  inset: 0;
  overflow: hidden;
  position: fixed;
  z-index: 50;
}
.player-wrapper:after {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  content: "";
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}
.player-wrapper .video-container {
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 50;
}
.player-wrapper .mobileclose {
  align-items: center;
  background-color: var(--color-pop-green);
  border-radius: 50%;
  color: var(--color-bg-dark);
  display: none;
  height: 48rem;
  justify-content: center;
  position: absolute;
  right: var(--grid-margin);
  top: var(--grid-margin);
  width: 48rem;
  z-index: 60;
}

@media screen and (max-width: 420px) {.player-wrapper .mobileclose {
    display: flex;
  }

}
.video-element {
  height: 100%;
  -o-object-fit: contain;
  object-fit: contain;
  -o-object-position: center;
  object-position: center;
  width: 100%;
}</style>
