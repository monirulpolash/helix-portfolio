<script setup lang="ts">
// Same as the original MenuSocialLinks: round icon links picked by the URL's domain.
const { socialLinks } = useContentStore()
const menu = useMenuStore()
const labels: Record<string, string> = { instagram: 'Instagram', twitter: 'X / Twitter', behance: 'Behance', linkedin: 'LinkedIn' }
const kind = (url: string) =>
  url.includes('instagram.com') ? 'instagram'
    : url.includes('twitter.com') || url.includes('x.com') ? 'twitter'
      : url.includes('behance.net') ? 'behance'
        : url.includes('linkedin.com') ? 'linkedin' : ''
</script>

<template>
  <div class="menu-social-links" :class="menu.isOpened ? 'opened' : 'closed'">
    <a
      v-for="(s, i) in socialLinks" :key="i" :href="s.url" target="_blank" rel="noopener noreferrer"
      class="social-link" :aria-label="(s as any).label || labels[kind(s.url)] || s.platform"
    >
      <span class="social-link-inner">
        <IconsInstagramIcon v-if="kind(s.url) === 'instagram'" />
        <IconsTwitterIcon v-else-if="kind(s.url) === 'twitter'" />
        <IconsBehanceIcon v-else-if="kind(s.url) === 'behance'" />
        <IconsLinkedinIcon v-else-if="kind(s.url) === 'linkedin'" />
      </span>
    </a>
  </div>
</template>

<style scoped>
/* layout from the original MenuSocialLinks component */
.menu-social-links {
  display: flex;
  will-change: opacity, transform;
}
.menu-social-links.closed {
  opacity: 0;
  transform: translateY(-10px) translate(10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transition-delay: 0;
}
.menu-social-links.opened {
  opacity: 1;
  transform: translateY(0) translate(0);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  transition-delay: 0.4s;
}
.menu-social-links .social-link {
  display: block;
  padding: 0 4rem;
}
.menu-social-links .social-link:last-child {
  padding-right: 0;
}
.menu-social-links .social-link:first-child {
  padding-left: 0;
}
.menu-social-links .social-link-inner {
  align-items: center;
  background-color: var(--color-bg-dark);
  border-radius: 50%;
  color: var(--color-white);
  display: flex;
  height: 48rem;
  justify-content: center;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease,
    color 0.3s ease;
  width: 48rem;
}
.menu-social-links:has(.social-link:hover)
  .social-link:not(:hover)
  .social-link-inner {
  background-color: var(--color-grey);
  color: var(--color-black);
  transform: scale(0.9);
}
</style>
