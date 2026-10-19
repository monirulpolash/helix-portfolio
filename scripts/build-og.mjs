// Builds the Open Graph (link preview) images before `nuxt generate`:
//   public/og/default.jpg      for the home and about pages
//   public/og/<slug>.jpg       one per project, cropped from its cover
// Social networks do not accept SVG previews, so covers are rasterised to 1200x630 JPEGs with sharp.
// If sharp is missing or a cover cannot be read, the build carries on and that page falls back to default.jpg.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { portfolio } from '../data/portfolio.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'og')
mkdirSync(out, { recursive: true })

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('[og] sharp is not installed; skipping Open Graph images.')
  process.exit(0)
}

async function load(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`${res.status} for ${src}`)
    return Buffer.from(await res.arrayBuffer())
  }
  const file = join(root, 'public', src.replace(/^\//, ''))
  if (!existsSync(file)) throw new Error(`missing ${file}`)
  return file
}

async function render(input, target) {
  await sharp(input, { density: 144 })
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .flatten({ background: '#444444' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target)
}

let ok = 0
for (const project of portfolio.projects) {
  try {
    await render(await load(project.image), join(out, `${project.slug}.jpg`))
    ok++
  } catch (err) {
    console.warn(`[og] ${project.slug}: ${err.message}`)
  }
}

// Default preview: three covers side by side on the site's grey.
try {
  const picks = portfolio.projects.slice(0, 3)
  const tiles = await Promise.all(
    picks.map(async (p) =>
      sharp(await load(p.image), { density: 144 }).resize(360, 470, { fit: 'cover' }).png().toBuffer(),
    ),
  )
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#444444' } })
    .composite(tiles.map((t, i) => ({ input: t, top: 80, left: 60 + i * 375 })))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(out, 'default.jpg'))
  ok++
} catch (err) {
  console.warn(`[og] default: ${err.message}`)
  // A plain grey image keeps the meta tag valid.
  writeFileSync(
    join(out, 'default.jpg'),
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#444444' } }).jpeg().toBuffer(),
  )
}

console.log(`[og] wrote ${ok} Open Graph images to public/og`)
