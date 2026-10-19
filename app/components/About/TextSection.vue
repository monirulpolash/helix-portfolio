<script setup lang="ts">
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolio } from '~~/data/portfolio.js'

// Same as the original AboutTextSection: a 500vh section with a sticky, centred paragraph.
// Words start at 0.5 opacity and light up one by one as you scroll (scrubbed); the small
// inline images pop in (scale 0 -> 1.5, back.out) right after the word they follow.
// The text comes from data/portfolio.js: each {n} becomes /media/about/text-n.png.
const tokens = portfolio.about.text
  .split(/(\{\d+\})/)
  .filter(Boolean)
  .map((t) => {
    const m = t.match(/^\{(\d+)\}$/)
    return m ? { img: `/media/about/text-${m[1]}.png` } : { text: t }
  })

const wrapper = ref<HTMLElement | null>(null)
let split: SplitText | null = null
let tl: gsap.core.Timeline | null = null

onMounted(() => {
  gsap.registerPlugin(SplitText, ScrollTrigger)
  const el = wrapper.value
  const p = el?.querySelector('.inner p') as HTMLElement | null
  if (!el || !p) return
  const images = el.querySelectorAll('.about-text-image')
  split = new SplitText(p, { type: 'words', wordsClass: 'word', tag: 'span' })
  const words = split.words
  const imageAfter: { el: Element; after: number }[] = []
  let w = -1
  Array.from(p.childNodes).forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const e = node as HTMLElement
    if (e.classList.contains('word')) w++
    if (e.classList.contains('about-text-image')) imageAfter.push({ el: e, after: w })
  })
  gsap.set(words, { opacity: 0.5 })
  gsap.set(images, { scale: 0, opacity: 0, transformOrigin: 'center center' })
  tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } })
  words.forEach((word, i) => {
    tl!.to(word, { opacity: 1, duration: 1 }, i)
    imageAfter.filter((t) => t.after === i).forEach((t) => {
      tl!.to(t.el, { scale: 1.5, opacity: 1, duration: 1.5, ease: 'back.out(1.7)' }, i + 0.2)
    })
  })
})
onBeforeUnmount(() => {
  // the original waits for the page transition before reverting
  setTimeout(() => { tl?.scrollTrigger?.kill(); tl?.kill(); split?.revert() }, 1000)
})
</script>

<template>
  <div ref="wrapper" class="wrapper">
    <div class="inner">
      <p class="text"><template v-for="(t, i) in tokens" :key="i"><img v-if="t.img" class="about-text-image" :src="t.img" alt=""><template v-else>{{ t.text }}</template></template></p>
    </div>
  </div>
</template>

<style scoped>/* layout from the original AboutTextSection component */
.wrapper {
  height: 500vh;
  width: 100%;
}
.wrapper .inner {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  padding: var(--grid-margin);
  position: sticky;
  top: 0;
  width: 100%;
}
.wrapper .inner .text {
  font-size: 32rem;
  font-weight: 500;
  line-height: 0.7;
  margin: 0;
  max-width: 800px;
  text-align: center;
  text-wrap: balance;
}
.wrapper .inner .text .about-text-image {
  aspect-ratio: 1/1;
  display: inline-block;
  height: auto;
  transform: translateY(4rem) scale(1.5);
  width: 32rem;
}

@media screen and (max-width: 900px) {.wrapper .inner .text {
    font-size: 28rem;
    line-height: 1;
  }
.wrapper .inner .text .about-text-image {
    display: none;
  }

}
.wrapper .inner .word {
  display: inline-block;
  will-change: opacity;
}</style>

<style>
/* words are created by SplitText at runtime, outside the scoped styles */
.inner .text .word { display: inline-block; will-change: opacity; }
</style>
