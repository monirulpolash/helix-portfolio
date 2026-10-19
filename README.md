# helix-portfolio

A structural rebuild of a spiral portfolio (Nuxt 4 + Three.js): the same layout, pages and interactions, with placeholder content only. No original images, videos, text, name or identity are included.

## Run it

```bash
npm install
npm run dev        # makes the placeholder media, then starts the dev server
npm run generate   # makes the placeholder media, then prerenders every page to .output/public
```

Vercel uses `npm run generate` (see `vercel.json`) and serves `.output/public`.

## Where things are

- `app/experience/` - the Three.js spiral engine (`Experience.ts`) and its shaders (`shaders.ts`)
- `app/components/ExperienceCanvas.vue` - mounts the engine and connects it to the stores and sounds
- `app/components/Loader.vue`, `Others/*`, `Menu/*`, `Ui/*`, `Project/ViewSwitch.vue` - loader with the two enter buttons, logo, sound button, menu, spiral/list switch and shared UI pieces
- `app/components/Project/List.vue`, `Project/Hover.vue` - list view and the bottom label that names the hovered spiral card
- `app/components/Video/*`, `ShowreelThumbnail.vue` - full-screen video player (hls.js), its controls, the project preview video and the showreel card
- `app/pages/projects/[slug].vue`, `app/components/Project/*` - project page: preview video, infos, styleframes, next project
- `app/pages/about.vue`, `app/components/About/*` - about page: scrubbed text, carousel, image trail, socials
- `app/utils/pageTransitions.ts` - page transitions
- `app/plugins/` - sound (Howler) and smooth scrolling (Lenis)
- `data/portfolio.js` - all the content: site name, about text, socials, credits and the projects
- `scripts/media.mjs` - makes the placeholder images, videos (HLS) and sounds in `public/media` at build time

## Make it yours

Edit `data/portfolio.js`. Each project has a slug, title, year, tags, texts and media paths. Put your own files in `public/` (not in `public/media`, which is generated at build time and not committed) and point the paths at them. Every `/projects/<slug>` page is prerendered from that list.
