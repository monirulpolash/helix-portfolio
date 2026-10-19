import { portfolio } from '~~/data/portfolio.js'

// /sitemap.xml, prerendered at build time from the same data file as the pages.
export default defineEventHandler((event) => {
  const base = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/about', priority: '0.6' },
    ...portfolio.projects.map((p) => ({ loc: `/projects/${p.slug}`, priority: '0.8' })),
  ]
  const body = urls
    .map((u) => `  <url>\n    <loc>${base}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
