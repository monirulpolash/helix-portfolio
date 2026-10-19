// Tiny sound synthesiser. Builds short WAV files in memory so the site ships with
// original sounds and no audio files at all. Howler plays them from data: URIs.
// To use your own sounds instead, set the paths in data/portfolio.js -> sounds.

const RATE = 22050

function toWavDataUri(samples: Float32Array, rate = RATE) {
  const bytes = new Uint8Array(44 + samples.length * 2)
  const view = new DataView(bytes.buffer)
  const write = (o: number, s: string) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)))
  write(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, samples.length * 2, true)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0))
    view.setInt16(44 + i * 2, s * 0x7fff, true)
  }
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `data:audio/wav;base64,${btoa(bin)}`
}

function render(seconds: number, fn: (t: number, i: number) => number) {
  const n = Math.floor(seconds * RATE)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = fn(i / RATE, i)
  return out
}

const TAU = Math.PI * 2
const env = (t: number, attack: number, decay: number) => Math.min(1, t / attack) * Math.exp(-t / decay)

export type SoundName = 'hover' | 'click' | 'open' | 'close' | 'switch' | 'ambient'

export function synthSounds(): Record<SoundName, string> {
  // A soft glassy tick.
  const hover = render(0.12, (t) => Math.sin(TAU * 1760 * t) * env(t, 0.002, 0.025) * 0.35 + Math.sin(TAU * 2640 * t) * env(t, 0.002, 0.012) * 0.15)

  // Two quick notes, up a fifth.
  const click = render(0.22, (t) => {
    const f = t < 0.06 ? 660 : 990
    const local = t < 0.06 ? t : t - 0.06
    return Math.sin(TAU * f * t) * env(local, 0.002, 0.05) * 0.4
  })

  // A rising airy sweep for opening a project.
  let seed = 1
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1
  let lp = 0
  const open = render(0.7, (t) => {
    const p = t / 0.7
    const cutoff = 0.02 + p * 0.25
    lp += (noise() - lp) * cutoff
    const tone = Math.sin(TAU * (300 + p * 500) * t) * 0.12
    return (lp * 0.9 + tone) * Math.sin(Math.PI * p) * 0.6
  })

  // The same, falling, for closing.
  lp = 0
  const close = render(0.45, (t) => {
    const p = t / 0.45
    lp += (noise() - lp) * (0.25 - p * 0.22)
    const tone = Math.sin(TAU * (700 - p * 400) * t) * 0.1
    return (lp * 0.8 + tone) * Math.sin(Math.PI * p) * 0.55
  })

  // Two soft blips for toggles.
  const toggle = render(0.25, (t) => {
    const a = Math.sin(TAU * 880 * t) * env(t, 0.002, 0.03)
    const b = t > 0.09 ? Math.sin(TAU * 1320 * t) * env(t - 0.09, 0.002, 0.04) : 0
    return (a + b) * 0.3
  })

  // An 8 second pad that loops seamlessly: every frequency completes whole cycles in 8 s.
  const LOOP = 8
  const notes = [110, 165, 220, 261.625, 330]
  const ambient = render(LOOP, (t) => {
    let v = 0
    notes.forEach((f, i) => {
      const lfo = 0.55 + 0.45 * Math.sin(TAU * (t / LOOP) * (i % 2 ? 1 : 2) + i)
      v += Math.sin(TAU * f * t) * lfo * (i === 0 ? 0.5 : 0.22)
    })
    return v * 0.18
  })

  return {
    hover: toWavDataUri(hover),
    click: toWavDataUri(click),
    open: toWavDataUri(open),
    close: toWavDataUri(close),
    switch: toWavDataUri(toggle),
    ambient: toWavDataUri(ambient),
  }
}
