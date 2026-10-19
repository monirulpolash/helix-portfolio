// Writes the abstract placeholder artwork in /public/images/project-XX/.
// It runs automatically before `dev` and `generate` with --if-missing (so nothing is overwritten),
// and those folders are not committed. It never touches a folder that is not named
// project-01..project-09, so your own images are safe. Once no project in data/portfolio.js
// points at them, they are simply unused. The art is pure SVG shapes and gradients (no text, no fonts), generated
// from code, so it is original and free to use.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
const W = 1600
const H = 900

const palettes = [
  ['#1d2b64', '#f8cdda', '#ff7a59', '#ffd166'],
  ['#0f2027', '#2c5364', '#00d2ff', '#e0f7ff'],
  ['#3a1c71', '#d76d77', '#ffaf7b', '#fff1e0'],
  ['#134e5e', '#71b280', '#e8f5c8', '#ffcb77'],
  ['#232526', '#414345', '#ff4e50', '#f9d423'],
  ['#ee9ca7', '#ffdde1', '#6a3093', '#a044ff'],
  ['#000428', '#004e92', '#9be15d', '#00e3ae'],
  ['#42275a', '#734b6d', '#f7971e', '#ffd200'],
  ['#c9d6ff', '#e2e2e2', '#1e3c72', '#ff6a88'],
]

// Small seeded random so the art is the same every run.
function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const motifs = [
  // 0 concentric rings
  (r, [, , c, d]) => {
    const cx = 900 + r() * 300, cy = 450 + (r() - 0.5) * 200
    return Array.from({ length: 9 }, (_, i) =>
      `<circle cx="${cx}" cy="${cy}" r="${60 + i * 55}" fill="none" stroke="${i % 2 ? c : d}" stroke-width="${10 - i * 0.8}" opacity="${0.9 - i * 0.08}"/>`).join('')
  },
  // 1 diagonal bands
  (r, [, , c, d]) => {
    const off = r() * 200
    return `<g transform="rotate(-28 800 450)">${Array.from({ length: 12 }, (_, i) =>
      `<rect x="-400" y="${-300 + off + i * 130}" width="2400" height="${30 + (i % 3) * 22}" fill="${i % 2 ? c : d}" opacity="${0.25 + (i % 4) * 0.15}"/>`).join('')}</g>`
  },
  // 2 dot grid with a lens
  (r, [, , c, d]) => {
    const lx = 500 + r() * 600, ly = 450
    let out = ''
    for (let x = 60; x < W; x += 56) for (let y = 50; y < H; y += 56) {
      const dist = Math.hypot(x - lx, y - ly)
      const rad = Math.max(2, 18 - dist / 30)
      out += `<circle cx="${x}" cy="${y}" r="${rad.toFixed(1)}" fill="${dist < 260 ? d : c}" opacity="0.85"/>`
    }
    return out
  },
  // 3 glossy sphere
  (r, [, , c, d], id) => {
    const cx = 650 + r() * 300, cy = 470
    return `<defs><radialGradient id="sph${id}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${d}"/><stop offset="0.8" stop-color="${c}"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient></defs>
      <ellipse cx="${cx + 40}" cy="${cy + 330}" rx="300" ry="40" fill="#000" opacity="0.25"/>
      <circle cx="${cx}" cy="${cy}" r="300" fill="url(#sph${id})"/>`
  },
  // 4 stacked arches
  (r, [, , c, d]) => {
    const x0 = 250 + r() * 200
    return Array.from({ length: 5 }, (_, i) => {
      const x = x0 + i * 230, w = 200
      return `<path d="M${x} 900 V${520 - (i % 2) * 120} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V900 Z" fill="${i % 2 ? c : d}" opacity="0.9"/>`
    }).join('')
  },
  // 5 flowing waves
  (r, [, , c, d]) => {
    const ph = r() * Math.PI * 2
    return Array.from({ length: 14 }, (_, i) => {
      let p = `M0 ${150 + i * 50}`
      for (let x = 0; x <= W; x += 40) {
        const y = 150 + i * 50 + Math.sin(x / 180 + ph + i * 0.35) * 60
        p += ` L${x} ${y.toFixed(1)}`
      }
      return `<path d="${p}" fill="none" stroke="${i % 2 ? c : d}" stroke-width="6" opacity="${0.35 + (i % 5) * 0.12}"/>`
    }).join('')
  },
  // 6 rotating squares
  (r, [, , c, d]) => {
    const cx = 800 + (r() - 0.5) * 300, cy = 450
    return Array.from({ length: 10 }, (_, i) => {
      const s = 620 - i * 58
      return `<rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" fill="none" stroke="${i % 2 ? c : d}" stroke-width="8" transform="rotate(${i * 9} ${cx} ${cy})" opacity="0.85"/>`
    }).join('')
  },
  // 7 a small helix of dots
  (r, [, , c, d]) => {
    const ph = r() * Math.PI
    let out = ''
    for (let i = 0; i < 46; i++) {
      const t = i * 0.42 + ph
      const x = 120 + i * 30
      const z = Math.sin(t)
      out += `<circle cx="${x}" cy="${(450 + Math.cos(t) * 220).toFixed(1)}" r="${(16 + z * 10).toFixed(1)}" fill="${z > 0 ? d : c}" opacity="${(0.55 + z * 0.4).toFixed(2)}"/>`
      out += `<circle cx="${x}" cy="${(450 - Math.cos(t) * 220).toFixed(1)}" r="${(16 - z * 10).toFixed(1)}" fill="${z > 0 ? c : d}" opacity="${(0.55 - z * 0.4).toFixed(2)}"/>`
    }
    return out
  },
  // 8 layered hills
  (r, [a, , c, d]) => {
    const cols = [d, c, a]
    return cols.map((col, i) => {
      let p = `M0 900 L0 ${520 + i * 110}`
      const ph = r() * 6
      for (let x = 0; x <= W; x += 50) p += ` L${x} ${(520 + i * 110 + Math.sin(x / (260 - i * 40) + ph) * (90 - i * 20)).toFixed(1)}`
      return `<path d="${p} L${W} 900 Z" fill="${col}" opacity="${0.95 - i * 0.1}"/>`
    }).join('') + `<circle cx="${1100 + r() * 200}" cy="260" r="110" fill="#fff" opacity="0.85"/>`
  },
]

function art(index, variant) {
  const pal = palettes[index % palettes.length]
  const [a, b, c, d] = pal
  const r = rng(index * 97 + variant * 13 + 7)
  const id = `${index}-${variant}`
  const angle = Math.round(r() * 360)
  const blobs = Array.from({ length: 3 }, (_, i) => {
    const col = [c, d, b][i]
    return `<radialGradient id="b${id}-${i}" cx="${(r() * 100).toFixed(0)}%" cy="${(r() * 100).toFixed(0)}%" r="${(35 + r() * 30).toFixed(0)}%"><stop offset="0" stop-color="${col}" stop-opacity="0.75"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`
  })
  // Variants zoom in on the motif, like detail shots of the same piece.
  const zoom = [1, 1.6, 2.3][variant]
  const fx = 800 - (800 / zoom) + (variant ? (r() - 0.5) * 300 : 0)
  const fy = 450 - (450 / zoom) + (variant ? (r() - 0.5) * 160 : 0)
  const motif = motifs[index % motifs.length](r, pal, id)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg${id}" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    ${blobs.join('\n    ')}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg${id})"/>
  ${blobs.map((_, i) => `<rect width="${W}" height="${H}" fill="url(#b${id}-${i})"/>`).join('\n  ')}
  <g transform="translate(${(-fx * zoom).toFixed(1)} ${(-fy * zoom).toFixed(1)}) scale(${zoom})">${motif}</g>
</svg>
`
}

const ifMissing = process.argv.includes('--if-missing')
let written = 0
for (let i = 0; i < 9; i++) {
  const dir = join(root, `project-${String(i + 1).padStart(2, '0')}`)
  mkdirSync(dir, { recursive: true })
  ;['cover', 'detail-1', 'detail-2'].forEach((name, variant) => {
    const file = join(dir, `${name}.svg`)
    if (ifMissing && existsSync(file)) return
    writeFileSync(file, art(i, variant))
    written++
  })
}
console.log(`[placeholders] wrote ${written} files in public/images/project-01..09`)
