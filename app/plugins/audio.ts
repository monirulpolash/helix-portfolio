import { portfolio } from '~~/data/portfolio.js'
import type { SoundName } from '~/utils/synth'

const VOLUMES: Record<SoundName, number> = {
  hover: 0.25,
  click: 0.5,
  open: 0.6,
  close: 0.5,
  switch: 0.4,
  ambient: 0.35,
}

/**
 * Optional sound, with Howler. Nothing loads until the visitor presses Enter (browsers block
 * audio before a user gesture). The mute choice is remembered in localStorage.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const muted = useState('audio-muted', () => false)
  const started = useState('audio-started', () => false)

  let howls: Partial<Record<SoundName, any>> | null = null
  let Howler: any = null

  async function build() {
    if (howls || !import.meta.client) return
    const mod = await import('howler')
    Howler = mod.Howler
    const { synthSounds } = await import('~/utils/synth')
    const synth = synthSounds()
    const custom = (portfolio.sounds || {}) as Partial<Record<SoundName, string | null>>
    howls = {}
    for (const name of Object.keys(VOLUMES) as SoundName[]) {
      const src = custom[name] || synth[name]
      howls[name] = new mod.Howl({
        src: [src],
        format: src.startsWith('data:') ? ['wav'] : undefined,
        volume: VOLUMES[name],
        loop: name === 'ambient',
        html5: false,
      })
    }
    Howler.mute(muted.value)
  }

  function syncAmbient() {
    const a = howls?.ambient
    if (!a) return
    if (!muted.value && started.value && !a.playing()) {
      a.volume(0)
      a.play()
      a.fade(0, VOLUMES.ambient, 1500)
    }
  }

  if (import.meta.client) {
    // Read the saved choice after hydration so server and client HTML match.
    nuxtApp.hook('app:mounted', () => {
      muted.value = localStorage.getItem('helix:muted') === '1'
    })
    document.addEventListener('visibilitychange', () => {
      Howler?.mute(document.hidden || muted.value)
    })
  }

  const audio = {
    muted,
    started,
    /** Call from a click handler (the Enter button). */
    async start(withSound = true) {
      if (!withSound) audio.setMuted(true)
      started.value = true
      await build()
      syncAmbient()
    },
    play(name: SoundName) {
      if (!howls || muted.value) return
      howls[name]?.play()
    },
    setMuted(value: boolean) {
      muted.value = value
      if (import.meta.client) localStorage.setItem('helix:muted', value ? '1' : '0')
      Howler?.mute(value)
      if (!value) syncAmbient()
    },
    async toggle() {
      const next = !muted.value
      audio.setMuted(next)
      if (!next) {
        started.value = true
        await build()
        syncAmbient()
        audio.play('switch')
      }
    },
  }

  return { provide: { audio } }
})
