<script setup lang="ts">
import type { Project } from '~/composables/stores'

// Mounts the WebGL spiral once for the whole app; it pauses off the home page.
const props = withDefaults(defineProps<{ projects?: Project[] }>(), { projects: () => [] })
const canvas = ref<HTMLCanvasElement | null>(null)
const store = useExperienceStore()
const route = useRoute()
const router = useRouter()
const audio = useAudio()
const isHome = computed(() => route.path === '/')
let experience: any = null

onMounted(async () => {
  if (!canvas.value || !props.projects.length) return
  const { Experience } = await import('~/experience/Experience')
  // The error page can replace the app while the engine chunk loads: the canvas is gone then.
  if (!canvas.value || !canvas.value.isConnected) return
  experience = new Experience(canvas.value, props.projects, {
    navigate: (slug) => router.push(`/projects/${slug}`),
    play: (s) => audio.play(s),
    hover: (p) => { store.hoveredProject = p as any },
    progress: (l, t) => store.onProgress(l, t),
  })
  store.setExperience(experience)
  if (!isHome.value) experience.pause()
})
watch(() => route.path, (p) => {
  const e = store.experience
  if (!e) return
  p === '/' ? e.resume() : setTimeout(() => e.pause(), 500)
})
onUnmounted(() => experience?.destroy())
</script>

<template>
  <BackgroundGrid />
  <canvas ref="canvas" class="webgl" :class="{ hide: !isHome }" />
</template>

<style scoped>
/* layout from the original ExperienceCanvas component */
.webgl {
  display: block;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  transition: opacity 0.5s ease-out;
  width: 100%;
  z-index: 0;
}
.webgl.hide {
  opacity: 0;
  pointer-events: none;
}
svg {
  transition: opacity 0.5s ease-out;
}
svg.hide {
  opacity: 0;
  pointer-events: none;
}
</style>
