<script setup lang="ts">
import gsap from 'gsap'

// Same as the original MenuLinks: works / about / contact. They slide in from the top right
// one after another when the panel opens and out in reverse when it closes. works and about
// close the menu and play their own sound unless you are already on that page.
const props = defineProps<{ isMenuOpen: boolean }>()
const { email } = useContentStore()
const menu = useMenuStore()
const experienceStore = useExperienceStore()
const audio = useAudio()
const route = useRoute()
const linkRefs = ref<HTMLElement[]>([])
const links = [
  { text: 'works', href: '/', closeMenu: true, onClick: () => audio.play('menuhome') },
  { text: 'about', href: '/about', closeMenu: true, onClick: () => audio.play('menuabout') },
  { text: 'contact', href: `mailto:${email}` },
] as { text: string; href: string; closeMenu?: boolean; onClick?: () => void }[]

onMounted(() => gsap.set(linkRefs.value, { y: -20, x: 20, opacity: 0 }))
watch(() => props.isMenuOpen, (open) => {
  gsap.killTweensOf(linkRefs.value)
  if (open) gsap.to(linkRefs.value, { y: 0, x: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out', stagger: 0.1 })
  else gsap.to(linkRefs.value, { y: -20, x: 20, opacity: 0, duration: 0.2, ease: 'power4.out', stagger: -0.05 })
})

function onLink(l: (typeof links)[number]) {
  if (l.closeMenu) { menu.closeMenu(); experienceStore.toggleMenu(false) }
  if (l.onClick && l.href !== route.path) l.onClick()
}
</script>

<template>
  <div class="links" :class="isMenuOpen ? 'opened' : 'closed'">
    <div v-for="l in links" :key="l.text" ref="linkRefs" class="link">
      <NuxtLink :to="l.href" :external="l.href.startsWith('mailto:')" @click="onLink(l)">
        <span>{{ l.text }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* layout from the original MenuLinks component */
.links {
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  pointer-events: none;
}
.links.opened {
  pointer-events: auto;
}
.links .link {
  cursor: pointer;
  font-size: 80rem;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 100%;
  margin: 0;
  transition: padding-left 0.5s var(--ease-spring);
  width: -moz-fit-content;
  width: fit-content;
}
.links .link:before {
  background-color: var(--color-bg-dark);
  border-radius: 24rem;
  content: "";
  height: 24rem;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(0);
  transition:
    transform 0.5s var(--ease-spring),
    opacity 0.5s var(--ease-spring);
  width: 24rem;
}

@media screen and (hover: hover) and (pointer: fine) {.links .link:hover {
    padding-left: 40rem;
  }
.links .link:hover:before {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

}
</style>
