import { portfolio } from './data/portfolio.js'

// Public URL for Open Graph images, canonical links and the sitemap.
const siteUrl = (
  process.env.NUXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  portfolio.site.url
).replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  runtimeConfig: { public: { siteUrl } },
  app: {
    head: {
      htmlAttrs: { lang: portfolio.site.lang },
      title: portfolio.site.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'description', content: portfolio.site.description },
        { property: 'og:image', content: `${siteUrl}/media/og.jpg` },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Free stand-in for the original's licensed Indivisible typeface.
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap' },
      ],
    },
  },
  // Every page is prerendered, so /projects/<slug> also works when opened directly.
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/about', '/sitemap.xml', '/robots.txt', ...portfolio.projects.map((p) => `/projects/${p.slug}`)],
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        'three', 'three/examples/jsm/postprocessing/EffectComposer.js', 'three/examples/jsm/postprocessing/RenderPass.js',
        'three/examples/jsm/postprocessing/ShaderPass.js', 'howler', 'lenis', 'gsap', 'gsap/ScrollTrigger', 'gsap/SplitText',
        'hls.js', 'lottie-web',
      ],
    },
  },
})
