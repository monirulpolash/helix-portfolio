// All site content lives here. Everything is placeholder: replace it with your own.
// Media paths under /media are generated at build time by scripts/media.mjs
// (abstract gradients, tones and test videos). Point them at your own files in /public
// or at any https URL when you have real work to show.

const palettes = [
  ['0x1d2b64', '0xff7a59'], ['0x0f3443', '0x34e89e'], ['0x41295a', '0xf7797d'],
  ['0x16222a', '0x3a6073'], ['0x780206', '0xf09819'], ['0x232526', '0x9d50bb'],
  ['0x134e5e', '0x71b280'], ['0x4b1248', '0xf0c27b'], ['0x1e3c72', '0x21ffc0'],
]

export const projects = palettes.map((colors, i) => {
  const n = String(i + 1).padStart(2, '0')
  const slug = `project-${n}`
  return {
    slug,
    title: `Project ${n}`,
    year: String(2025 - (i % 4)),
    shortDescription:
      'Placeholder description. Two or three lines about the brief, the idea and what you made: motion design, 3D, art direction or anything else.',
    behanceUrl: 'https://www.behance.net/',
    colors,
    thumbnail: `/media/${slug}/thumb.jpg`,
    // small copy for the spiral hover label (48px on screen); leave it out to fall back to thumbnail
    thumbnailSmall: `/media/${slug}/thumb-s.jpg`,
    video: slug,
    styleframes: Array.from({ length: 6 }, (_, k) => `/media/${slug}/sf-${k + 1}.jpg`),
  }
})

export const portfolio = {
  site: {
    name: 'Your Name',
    // Line shown on the loader under the intro animation.
    tagline: 'designer & creative based in your city',
    description: 'Placeholder portfolio: motion design, 3D and art direction.',
    url: 'https://helix-portfolio-weld.vercel.app',
    lang: 'en',
  },
  email: 'hello@example.com',
  showreel: { video: 'showreel', thumbnail: '/media/showreel/poster.jpg', colors: ['0x0a0a0a', '0x21ffc0'] },
  socialLinks: [
    { platform: 'instagram', url: 'https://www.instagram.com/' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/' },
    { platform: 'behance', url: 'https://www.behance.net/' },
    { platform: 'twitter', url: 'https://x.com/' },
  ],
  credits: [
    { role: 'design', name: '@designer', url: 'https://www.instagram.com/' },
    { role: 'development', name: '@developer', url: 'https://www.instagram.com/' },
  ],
  about: {
    // Each {n} becomes a small inline image (/media/about/text-n.png).
    text: 'hi, I’m Your Name {1}, a designer based in Your City {2}. I make motion {3}, 3D {4} and visual identities {5} for brands and studios. always curious, always learning {6}',
    carousel: Array.from({ length: 6 }, (_, k) => `/media/about/carousel-${k + 1}.jpg`),
    cta: 'let’s work together!',
  },
  projects,
}

export const videoSrc = (id) => ({
  hls: `/media/${id}/index.m3u8`,
  poster: `/media/${id}/poster.jpg`,
  thumb: (pct) => `/media/${id}/t${pct}.jpg`,
})
