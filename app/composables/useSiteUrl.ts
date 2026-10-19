/** Turns a path into an absolute URL on the site's public domain (for Open Graph and canonical tags). */
export function useAbsoluteUrl() {
  const base = useRuntimeConfig().public.siteUrl as string
  return (path: string) => (/^https?:\/\//.test(path) ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`)
}
