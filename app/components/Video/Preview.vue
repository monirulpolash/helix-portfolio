<script setup lang="ts">
// Same as the original VideoPreview (top of the project page): a muted, looping, full-height
// cover video. With a mouse on desktop a "play !" UiCursorTag follows the cursor; clicking
// opens the full-screen VideoPlayer ("video-fade") with sound, fading the site sound out
// while it plays and back in when it closes.
import type Hls from 'hls.js'
import { videoSrc } from '~~/data/portfolio.js'
import { attachHls } from '~/composables/useHlsVideo'

const props = defineProps<{ video: string }>()
const src = videoSrc(props.video)
const audio = useAudio()
const audioStore = useAudioStore()
const { tabletPortrait, touch } = useBreakpoint()

const wrapperRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const open = ref(false)
let hls: Hls | null = null

const onPlay = () => { isPlaying.value = true }
function openPlayer() {
  open.value = true
  if (audioStore.enabled) audio.animateGlobalVolume(0, 500)
}
function closePlayer() {
  open.value = false
  if (audioStore.enabled) setTimeout(() => audio.animateGlobalVolume(1, 500), 500)
}

onMounted(() => {
  const v = videoRef.value
  if (!v) return
  v.addEventListener('play', onPlay)
  hls = attachHls(v, src.hls, { muted: true })
})
onBeforeUnmount(() => {
  hls?.destroy()
  videoRef.value?.removeEventListener('play', onPlay)
})
</script>

<template>
  <div ref="wrapperRef" class="preview-wrapper">
    <video
      ref="videoRef"
      playsinline
      autoplay
      muted
      loop
      disablepictureinpicture
      class="preview-video"
      :poster="src.poster"
      @click="openPlayer"
    />
    <UiCursorTag v-if="!touch && !tabletPortrait" :wrapper="wrapperRef" label="play !" />
    <Transition name="video-fade">
      <VideoPlayer v-if="open" :video="video" :thumbnail="src.poster" @close="closePlayer" />
    </Transition>
  </div>
</template>

<style scoped>/* layout from the original VideoPreview component */
.preview-wrapper {
  height: calc(100vh - var(--grid-margin));
  overflow: hidden;
  position: relative;
  width: 100%;
}

@media screen and (max-width: 900px) {.preview-wrapper {
    height: 60vh;
  }

}
.preview-video {
  cursor: pointer;
  display: block;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 100%;
}</style>
