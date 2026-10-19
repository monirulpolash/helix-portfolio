import { Howl, Howler } from 'howler'

// Same sound map and API as the original audio plugin. Files are synthesized placeholders
// made by scripts/media.mjs; swap in your own under public/media/sounds.
const config: Record<string, { volume: number; loop?: boolean }> = {
  ambient: { volume: 0.3, loop: true }, hover: { volume: 1 }, click: { volume: 0.5 }, spiral: { volume: 0.4 },
  list: { volume: 0.4 }, tick: { volume: 0.2 }, longclick: { volume: 0.5 }, switch: { volume: 0.5 }, close: { volume: 0.7 },
  menuhome: { volume: 0.25 }, menuabout: { volume: 0.25 },
  smiley1: { volume: 0.2 }, smiley2: { volume: 0.2 }, smiley3: { volume: 0.2 }, smiley4: { volume: 0.2 },
}

export default defineNuxtPlugin(() => {
  const sounds = Object.fromEntries(
    Object.entries(config).map(([name, c]) => [name, new Howl({ src: [`/media/sounds/${name}.mp3`], html5: true, preload: true, loop: !!c.loop, volume: c.volume })]),
  )
  document.addEventListener('visibilitychange', () => Howler.mute(document.hidden))
  const play = (name: string, once = false) => { if (!(once && sounds[name]?.playing())) sounds[name]?.play() }
  const stop = (name: string) => sounds[name]?.stop()
  const setVolume = (v: number) => Howler.volume(v)
  const mute = (m: boolean) => Howler.mute(m)
  // Fades the master volume between 0 and 1 (only when it is at the opposite end).
  const animateGlobalVolume = (to: number, ms = 500) => {
    const from = Howler.volume()
    if (from === to || from !== 1 - to) return
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min((t - t0) / ms, 1)
      Howler.volume(from + (to - from) * k)
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  return { provide: { audio: { play, stop, setVolume, mute, animateGlobalVolume, sounds } } }
})
