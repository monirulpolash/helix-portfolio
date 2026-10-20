// Generates every placeholder asset at build time with ffmpeg (no binaries live in the repo):
// project thumbnails, styleframes, HLS videos with posters and scrub thumbnails, the showreel,
// about images, stickers, Open Graph images and UI sounds. Re-runs are skipped per file.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { portfolio } from '../data/portfolio.js'

const require = createRequire(import.meta.url)
let ff = require('ffmpeg-static')
if (!existsSync(ff)) execFileSync(process.execPath, [require.resolve('ffmpeg-static/install.js')], { stdio: 'inherit' })
const OUT = 'public/media'
const run = (args) => execFileSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' })
const dir = (d) => (mkdirSync(`${OUT}/${d}`, { recursive: true }), `${OUT}/${d}`)
const grad = (s, c, seed, extra = '') =>
  `gradients=s=${s}:c0=${c[0]}:c1=${c[1]}:c2=${c[2] || '0x0a0a0a'}:n=3:type=${seed % 4}:seed=${seed}:speed=0.015${extra}`
const still = (file, src, vf = '') => { if (!existsSync(file)) run(['-f', 'lavfi', '-i', src, ...(vf ? ['-vf', vf] : []), '-frames:v', '1', '-q:v', '3', file]) }

function video(id, colors, seed, dur) {
  const d = dir(id)
  if (!existsSync(`${d}/index.m3u8`)) {
    run([
      '-f', 'lavfi', '-i', `${grad('1280x720', colors, seed, `:d=${dur}:r=25`)},format=yuv420p`,
      '-f', 'lavfi', '-i', `aevalsrc='0.07*sin(2*PI*(${180 + seed * 7}+30*sin(2*PI*0.08*t))*t)*(0.6+0.4*sin(2*PI*0.25*t))':s=44100:d=${dur}`,
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-g', '50', '-c:a', 'aac', '-b:a', '64k', '-shortest',
      '-hls_time', '4', '-hls_playlist_type', 'vod', '-hls_segment_filename', `${d}/s%02d.ts`, `${d}/index.m3u8`,
    ])
  }
  for (const p of [0, 20, 40, 60, 80]) {
    const f = p ? `${d}/t${p}.jpg` : `${d}/poster.jpg`
    if (!existsSync(f)) run(['-ss', String((dur * p) / 100 + 0.5), '-f', 'lavfi', '-i', grad(p ? '320x180' : '1280x720', colors, seed, `:d=${dur}:r=25`), '-frames:v', '1', '-q:v', '4', f])
  }
}

portfolio.projects.forEach((p, i) => {
  const d = dir(p.slug)
  still(`${d}/thumb.jpg`, grad('1280x800', p.colors, i + 3))
  if (!existsSync(`${d}/thumb-s.jpg`)) run(['-i', `${d}/thumb.jpg`, '-vf', 'scale=-2:128', '-q:v', '4', `${d}/thumb-s.jpg`])
  still(`${OUT}/og-${p.slug}.jpg`, grad('1200x630', p.colors, i + 3))
  p.styleframes.forEach((_, k) => {
    const src = k % 3 === 2 ? `mandelbrot=s=1920x1080:start_scale=${1 + k}:end_pts=${k}` : grad('1920x1080', [p.colors[k % 2], p.colors[(k + 1) % 2]], i * 10 + k)
    still(`${d}/sf-${k + 1}.jpg`, src, k % 3 === 2 ? `hue=h=${i * 40}` : '')
  })
  video(p.slug, p.colors, i + 1, 12)
})
video('showreel', portfolio.showreel.colors, 42, 20)
still(`${OUT}/og.jpg`, grad('1200x630', portfolio.showreel.colors, 7))

const about = dir('about')
portfolio.about.carousel.forEach((_, k) => still(`${about}/carousel-${k + 1}.jpg`, grad('900x1200', portfolio.projects[k].colors, k + 20)))
for (let k = 1; k <= 12; k++) {
  const c = portfolio.projects[k % 9].colors
  if (k <= 6) still(`${about}/text-${k}.png`, grad('120x120', c, k + 30), `format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(hypot(X-60,Y-60),58),255,0)'`)
  still(`${about}/sticker-${k}.png`, grad('300x300', c, k + 50), `format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(hypot(X-150,Y-150),${k % 2 ? 148 : 120}),255,0)'`)
}

// UI sounds (all synthesized): name -> [expression, duration]
const snd = dir('sounds')
const env = (k) => `exp(-${k}*t)`
const sounds = {
  ambient: [`0.05*(sin(2*PI*110*t)+0.6*sin(2*PI*164.8*t)+0.4*sin(2*PI*220.5*t))*(0.7+0.3*sin(2*PI*0.1*t))`, 20],
  hover: [`0.25*sin(2*PI*1400*t)*${env(60)}`, 0.12],
  click: [`0.4*sin(2*PI*700*t)*${env(40)}`, 0.15],
  tick: [`0.25*sin(2*PI*2000*t)*${env(90)}`, 0.06],
  spiral: [`0.3*sin(2*PI*(300+600*t)*t)*${env(6)}`, 0.5],
  list: [`0.3*sin(2*PI*(800-500*t)*t)*${env(6)}`, 0.5],
  switch: [`0.3*sin(2*PI*520*t)*${env(25)}`, 0.2],
  longclick: [`0.3*sin(2*PI*(200+300*t)*t)*${env(2.5)}`, 1.2],
  close: [`0.3*sin(2*PI*(600-300*t)*t)*${env(12)}`, 0.3],
  menuhome: [`0.3*sin(2*PI*660*t)*${env(15)}`, 0.3],
  menuabout: [`0.3*sin(2*PI*880*t)*${env(15)}`, 0.3],
  smiley1: [`0.3*sin(2*PI*523*t)*${env(10)}`, 0.4],
  smiley2: [`0.3*sin(2*PI*659*t)*${env(10)}`, 0.4],
  smiley3: [`0.3*sin(2*PI*784*t)*${env(10)}`, 0.4],
  smiley4: [`0.3*sin(2*PI*1046*t)*${env(10)}`, 0.4],
}
for (const [name, [expr, d]] of Object.entries(sounds)) {
  const f = `${snd}/${name}.mp3`
  if (!existsSync(f)) run(['-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${d}`, '-c:a', 'libmp3lame', '-b:a', '96k', f])
}
console.log('placeholder media ready in', OUT)
