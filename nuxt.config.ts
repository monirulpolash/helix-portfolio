import { portfolio } from './data/portfolio.js'

// The public URL is used for absolute Open Graph image URLs, canonical links and the sitemap.
// Order: explicit env var > Vercel's production domain (set automatically at build time) > data file.
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

  runtimeConfig: {
    public: { siteUrl },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: portfolio.site.lang || 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#444444' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  // Every page is written to HTML at build time, including every project page,
  // so /projects/<slug> works when opened directly (the original site 404s there).
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/',
        '/about',
        '/sitemap.xml',
        '/robots.txt',
        ...portfolio.projects.map((p) => `/projects/${p.slug}`),
      ],
    },
  },

  vite: {
    optimizeDeps: { include: ['three', 'howler', 'lenis'] },
  },
})
