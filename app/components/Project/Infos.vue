<script setup lang="ts">
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '~/composables/stores'

// Same as the original ProjectInfos: title on the left, short description and a "see the case"
// UiSolidButton on the right. Title and description lines rise in (yPercent 100 -> 0, stagger
// 0.08) once, when the block reaches 95% of the viewport.
const props = defineProps<{ project: Project }>()
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(SplitText, ScrollTrigger)
  ctx = gsap.context(() => {
    if (!titleRef.value || !descRef.value) return
    const a = new SplitText(titleRef.value, { type: 'lines', linesClass: 'line' })
    const b = new SplitText(descRef.value, { type: 'lines', linesClass: 'line' })
    const lines = [...a.lines, ...b.lines]
    gsap.set(lines, { yPercent: 100, opacity: 0 })
    gsap.to(lines, {
      yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: titleRef.value, start: 'top 95%', once: true },
    })
  })
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div class="infos">
    <h2 ref="titleRef">{{ props.project.title }}</h2>
    <div class="right">
      <p ref="descRef">{{ props.project.shortDescription }}</p>
      <UiSolidButton v-if="props.project.behanceUrl" :link="props.project.behanceUrl" label="see the case" class="dark" />
    </div>
  </div>
</template>

<style scoped>/* layout from the original ProjectInfos component */
.infos {
  align-items: flex-start;
  display: flex;
  gap: var(--grid-gutter);
  padding: 60rem calc(var(--grid-column) * 1 + var(--grid-gutter) * 1);
  width: 100%;
}

@media screen and (max-width: 900px) {.infos {
    flex-direction: column;
    gap: 30rem;
    padding: 40rem var(--grid-margin);
  }

}
.infos h2 {
  font-size: 56rem;
  font-weight: 500;
  width: calc(var(--grid-column) * 5 + var(--grid-gutter) * 4);
}

@media screen and (max-width: 900px) {.infos h2 {
    font-size: 40rem;
    width: 100%;
  }

}
.infos .right {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 40rem;
  padding-top: 8rem;
}
.infos p {
  font-size: 18rem;
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
  max-width: calc(var(--grid-column) * 3 + var(--grid-gutter) * 2);
}

@media screen and (max-width: 900px) {.infos p {
    font-size: 16rem;
    max-width: 100%;
  }

}
.infos .line {
  display: block;
  overflow: hidden;
}</style>

<style>
/* lines are created by SplitText at runtime, outside the scoped styles */
.infos .line { display: block; overflow: hidden; }
</style>
