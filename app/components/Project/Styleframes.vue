<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Same as the original ProjectStyleframes: a column of rounded frames, every second one
// aligned right. Each frame scales 0.5 -> 1 and fades in while its image zooms 1.5 -> 1,
// once, when the frame reaches 85% of the viewport.
const props = defineProps<{ styleframes: string[] }>()
const frameRefs = ref<HTMLElement[]>([])
let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    frameRefs.value.forEach((frame) => {
      const img = frame.querySelector('img')
      if (!img) return
      gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
        .to(frame, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0)
        .to(img, { scale: 1, duration: 1.1, ease: 'power3.out' }, 0)
    })
  })
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div class="styleframes">
    <div v-for="(src, i) in props.styleframes" :key="`styleframe-${i}`" ref="frameRefs" class="styleframe">
      <img :src="src" alt="" loading="lazy">
    </div>
  </div>
</template>

<style scoped>/* layout from the original ProjectStyleframes component */
.styleframes {
  display: flex;
  flex-direction: column;
  gap: 32rem;
  justify-content: flex-start;
  padding: 60rem calc(var(--grid-column) * 1 + var(--grid-gutter) * 1)
    calc(var(--grid-column) * 1 + var(--grid-gutter) * 1);
  width: 100%;
}

@media screen and (max-width: 900px) {.styleframes {
    gap: 24rem;
    padding: 24rem var(--grid-margin);
  }

}
.styleframes .styleframe {
  border-radius: 14rem;
  display: flex;
  opacity: 0;
  overflow: hidden;
  position: relative;
  transform: scale(0.5);
  transform-origin: center center;
  width: calc(var(--grid-column) * 5 + var(--grid-gutter) * 4);
  will-change: transform, opacity;
}
.styleframes .styleframe img {
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  transform: scale(1.5);
  width: 100%;
  will-change: transform;
}

@media screen and (max-width: 900px) {.styleframes .styleframe {
    width: 100%;
  }

}
.styleframes .styleframe:nth-child(2n) {
  align-self: flex-end;
}</style>
