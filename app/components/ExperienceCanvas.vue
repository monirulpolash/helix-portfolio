<script setup lang="ts">
import { markRaw } from 'vue'
import { portfolio } from '~~/data/portfolio.js'
import { MOTION } from '~/experience/config'

// The one WebGL canvas. It lives in app.vue, so it survives route changes: going back to the
// home page re-reveals the same helix instead of rebuilding it.
const canvas = ref<HTMLCanvasElement | null>(null)
const helix = useHelix()
const route = useRoute()
const router = useRouter()
const { $audio } = useNuxtApp()
const isHome = computed(() => route.path === '/')

onMounted(async () => {
  if (!canvas.value) return
  try {
    const { Experience } = await import('~/experience/Experience')
    const exp = new Experience(canvas.value, portfolio.projects, {
      onProgress: (p) => (helix.progress = p),
      onReady: () => {
        helix.ready = true
        if (isHome.value && helix.entered && helix.mode === 'spiral') exp.reveal(MOTION.enterDelay)
      },
      onHover: (p) => {
        helix.hovered = p
        if (p) $audio.play('hover')
      },
      onOpen: (p) => {
        $audio.play('open')
        router.push(`/projects/${p.slug}`)
      },
    })
    exp.setActive(isHome.value && helix.mode === 'spiral')
    helix.experience = markRaw(exp)
  } catch (err) {
    // No WebGL: the home page falls back to the plain list.
    console.warn('[helix] WebGL unavailable', err)
    helix.failed = true
    helix.ready = true
    helix.progress = 1
    helix.mode = 'list'
  }
})

// Leaving / returning to the home page.
watch(
  () => route.path,
  (to, from) => {
    const exp = helix.experience
    if (from === '/' && to !== '/') {
      exp?.hide()
      exp?.setActive(false)
      helix.hovered = null
    }
    if (to === '/' && from !== '/') {
      helix.entered = true // they have already been on the site, skip the intro
      if (helix.mode === 'spiral' && exp) {
        exp.setActive(true)
        if (exp.ready) exp.reveal(MOTION.returnDelay)
      }
    }
  },
)

onBeforeUnmount(() => {
  helix.experience?.dispose()
  helix.experience = null
})
</script>

<template>
  <canvas ref="canvas" class="webgl" :class="{ 'is-off': !isHome }" aria-hidden="true" />
</template>

<style scoped>
.webgl {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100lvh;
  display: block;
  z-index: 0;
  touch-action: none;
  outline: none;
  transition: opacity 0.6s ease;
}
.webgl.is-off {
  opacity: 0;
  pointer-events: none;
}
</style>
