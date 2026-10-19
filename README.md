# Helix Portfolio

A portfolio site where your projects sit on a 3D helix that turns as you scroll or swipe. Built with **Nuxt 4** and **Three.js**, generated as a fully static site, deployable to Vercel (or any static host).

The engine is an independent rebuild of the behaviour of a well-known WebGL portfolio: same helix geometry, same card shaders, same custom scroll controller. All content here is placeholder: the project names, the text and the abstract artwork (generated from code), and the sounds (synthesised in the browser). Swap in your own work in one file.

## What it does

- **Home:** a Three.js helix of project cards. Wheel, trackpad, arrow keys or swipe turn it, with easing, friction and a slow idle drift. Hovering a card darkens and zooms it and shows its title. Click (or tap) opens the project while the cards sink away.
- **Spiral / List switch:** a plain list of the same projects. It is also in the HTML at all times for search engines and screen readers, and it is what visitors see if their device has no WebGL.
- **Project pages:** prerendered for every project, so `/projects/<slug>` works when opened directly or shared. Keep scrolling past the end (wheel or swipe) to fill the bar and go to the next project. `Esc` or Close goes back to the helix.
- **About page:** bio, services, clients, contact, plus an image trail that follows the cursor on desktop.
- **Intro loader:** shows texture loading progress, then *Enter* or *Enter without sound*.
- **Sound (optional):** hover, click, open, close and an ambient loop, played with Howler. A toggle in the header mutes it, and the choice is remembered.
- **SEO:** a title, description, canonical link, Open Graph and Twitter tags on every page, a 1200x630 preview image per project (built at deploy time), `sitemap.xml` and `robots.txt`.
- **Responsive:** a wider camera on screens under 900 px, touch swiping, safe-area padding, and layouts that stack on phones. Respects `prefers-reduced-motion`.

## Edit your content

Everything is in **`data/portfolio.js`**.

- `site`: your name, role, intro paragraphs, services, clients, email, socials and `url` (your domain).
- `projects`: one object per project. Add, remove or reorder freely; the helix, list, pages, sitemap and preview images all follow.

```js
{
  slug: 'my-project',            // the URL: /projects/my-project
  title: 'My Project',
  year: '2026',
  role: 'Design, Development',
  client: 'Client name',
  tags: ['Website', 'WebGL'],
  summary: 'One sentence. Also the link-preview text.',
  description: ['Paragraph one.', 'Paragraph two.'],
  image: '/images/my-project/cover.jpg',           // helix card + page hero, 16:9 is best
  gallery: ['/images/my-project/1.jpg', '/images/my-project/2.jpg'],
  link: 'https://example.com',   // optional
}
```

**Images:** put them in `public/images/` (any folder layout) and use paths starting with `/images/...`, or use full `https://` URLs. JPG, PNG, WebP and SVG all work. Keep covers around 1600 px wide or less so the helix loads fast. The placeholder art in `public/images/project-01` to `project-09` is generated from code before every `dev` and `generate` run and is not committed; once no project points at it, it is simply unused.

**Sounds:** to use your own files, put them in `public/sounds/` and set the paths under `sounds` in the data file, for example `hover: '/sounds/hover.mp3'`. Any sound left as `null` uses the built-in synthesised one.

**Look and feel:** colours and fonts are CSS variables at the top of `app/assets/css/main.css`. Every helix number (radius, spacing, speeds, hover strength, camera) is in `app/experience/config.ts`. If you change the background colour, change `LOOK.fillColor` there too so distant cards fade into it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static site in .output/public
npm run preview    # serve the generated site
```

Node 20 or newer.

## Structure

```
data/portfolio.js            all content (edit this)
app/
  app.vue                    persistent WebGL canvas + header + pages, site-wide SEO defaults
  pages/
    index.vue                loader, hover label, spiral/list switch, project list
    projects/[slug].vue      project page (prerendered for every slug)
    about.vue
  components/
    ExperienceCanvas.vue     creates the Three.js experience once, keeps it across routes
    SiteHeader.vue           logo, nav, sound toggle
    NextProject.vue          over-scroll to the next project
    ImageTrail.vue           cursor image trail on the about page
  experience/                the WebGL engine, plain TypeScript
    Experience.ts            renderer, camera, composer, textures, picking, render loop
    Controls.ts              custom wheel / swipe / key controller (no Lenis or GSAP here)
    ProjectPlane.ts          one card: helix placement, hover and reveal animation
    shaders.ts               card vertex/fragment shaders, edge-fade pass
    config.ts                every tunable value
  plugins/
    audio.ts                 Howler sounds + mute state
    lenis.client.ts          smooth scroll on the regular pages
  utils/synth.ts             generates the default sounds as WAV in memory
  composables/               shared helix state, absolute URLs
  assets/css/main.css        global styles
server/routes/               sitemap.xml and robots.txt (prerendered)
scripts/
  build-og.mjs               makes the 1200x630 link-preview images (runs before generate)
  make-placeholders.mjs      makes the placeholder artwork
```

### How the helix works

- The project list is used twice (18 cards for 9 projects), so the wrap-around happens out of sight. Each card's slot is `index - offset`, wrapped to the list length. Its angle is `slot x 0.85` rad and its height `slot x 0.5`, on a radius of 2, so the cards climb a spiral.
- Input only changes a target speed. Each frame the speed eases towards the target (10%), the offset moves by the speed, and the target decays (x0.9) down to a 0.002 idle drift. These factors are scaled by frame time, so it turns at the same pace on 60 Hz and 120 Hz screens.
- The vertex shader bows each card (`sin(uv.x * PI) * 0.2`), curves the column (`worldY^2 * 0.1`) and bends cards with scroll speed. The fragment shader does object-fit cover, a 55% darken and 5% zoom on hover, a frosted blurred back face, and a rounded-rectangle reveal. A full-screen pass fades the top and bottom 20% into the background.
- The canvas lives outside the pages, so going back to the home page re-reveals the same scene instead of rebuilding it. When it is off screen, rendering stops.

## Deploy

**Vercel:** import the repo, or deploy with the CLI. `vercel.json` sets the build command to `npm run generate`, and Nuxt detects Vercel and outputs a static build. The production domain is picked up automatically for preview images and the sitemap. To use a custom domain, set `NUXT_PUBLIC_SITE_URL` in the project's environment variables.

**Anywhere else:** run `npm run generate` and upload `.output/public`. Set `NUXT_PUBLIC_SITE_URL` (or `site.url` in the data file) to your domain first.

## Credits

Engine code, placeholder artwork and sounds in this repo are original. Libraries: Nuxt, Vue, Three.js, Howler.js, Lenis, sharp. Font: Space Grotesk (SIL Open Font License, loaded from Google Fonts).
