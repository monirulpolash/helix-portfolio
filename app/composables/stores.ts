import { reactive, markRaw } from 'vue'
import { portfolio, projects } from '~~/data/portfolio.js'
import type { Experience } from '~/experience/Experience'

// Mirrors the original Pinia stores (experience, homeview, content, audio, menu) as plain
// reactive singletons. Everything that touches them runs on the client.

const experience = reactive({
  experience: null as Experience | null,
  progress: 0, targetProgress: 0, isReady: false, hasEntered: false, _raf: 0,
  hoveredProject: null as Project | null,
  setExperience(e: Experience) {
    experience.experience = markRaw(e)
    const ease = () => {
      experience.progress += (experience.targetProgress - experience.progress) * 0.02
      if (experience.targetProgress >= 100 && Math.abs(experience.progress - 100) < 0.5) {
        experience.progress = 100; experience.isReady = true; return
      }
      experience._raf = requestAnimationFrame(ease)
    }
    experience._raf = requestAnimationFrame(ease)
  },
  onProgress(loaded: number, total: number) { experience.targetProgress = (loaded / total) * 100 },
  setHasEntered(v = true) {
    experience.hasEntered = v
    setTimeout(() => experience.experience?.world?.revealProjects(), 200)
  },
  toggleMenu(v: boolean | null = null) { experience.experience?.logics.toggleMenu(v) },
})
export const useExperienceStore = () => experience

const homeView = reactive({ mode: 'spiral' as 'spiral' | 'list', setMode(m: 'spiral' | 'list') { homeView.mode = m } })
export const useHomeViewStore = () => homeView

const menu = reactive({
  isOpened: false,
  toggleMenu() { menu.isOpened = !menu.isOpened },
  openMenu() { menu.isOpened = true },
  closeMenu() { menu.isOpened = false },
})
export const useMenuStore = () => menu

const audioStore = reactive({ enabled: true, setEnabled(v: boolean) { audioStore.enabled = v } })
export const useAudioStore = () => audioStore

export type Project = (typeof projects)[number]
export const useContentStore = () => ({
  projects,
  socialLinks: portfolio.socialLinks,
  email: portfolio.email,
  showreel: portfolio.showreel,
  getProjectBySlug: (slug: string) => projects.find((p) => p.slug === slug),
  getNextProject: (slug: string) => {
    const i = projects.findIndex((p) => p.slug === slug)
    return i === -1 ? null : projects[(i + 1) % projects.length]!
  },
})

type Audio = {
  play: (n: string, once?: boolean) => void; stop: (n: string) => void; setVolume: (v: number) => void
  mute: (m: boolean) => void; animateGlobalVolume: (to: number, ms?: number) => void
}
const noop: Audio = { play() {}, stop() {}, setVolume() {}, mute() {}, animateGlobalVolume() {} }
export const useAudio = (): Audio => (useNuxtApp().$audio as Audio) || noop
