<script setup lang="ts">
// Same as the original MenuFooter: the email address and the social icons at the panel's foot.
const { email } = useContentStore()
const menu = useMenuStore()
</script>

<template>
  <div class="menu-footer">
    <a :href="`mailto:${email}`" :class="menu.isOpened ? 'opened' : 'closed'">{{ email }}</a>
    <MenuSocialLinks />
  </div>
</template>

<style scoped>
/* layout from the original MenuFooter component */
.menu-footer {
  align-items: center;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20rem;
  justify-content: space-between;
  left: 0;
  padding: var(--gap-20);
  padding-left: 45rem;
  pointer-events: all;
  position: absolute;
  width: 100%;
}
.menu-footer a {
  color: var(--color-bg-dark);
  font-size: 16rem;
  font-weight: 500;
  text-decoration: none;
  will-change: opacity, transform;
}
.menu-footer a.closed {
  opacity: 0;
  transform: translateY(-10px) translate(10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transition-delay: 0;
}
.menu-footer a.opened {
  opacity: 1;
  transform: translateY(0) translate(0);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  transition-delay: 0.3s;
}

@media screen and (max-width: 900px) {.menu-footer {
    padding-left: var(--gap-20);
  }

}
</style>
