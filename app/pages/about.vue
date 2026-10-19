<script setup lang="ts">
import { portfolio } from '~~/data/portfolio.js'

const { site, projects } = portfolio
const abs = useAbsoluteUrl()

useSeoMeta({
  title: 'About',
  description: site.about[0],
  ogTitle: `About — ${site.author}`,
  ogDescription: site.about[0],
  ogImage: abs('/og/default.jpg'),
})

const images = projects.map((p) => p.image)
</script>

<template>
  <main class="about">
    <ImageTrail :images="images" />

    <section class="intro">
      <p class="eyebrow">About</p>
      <h1>{{ site.author }}<br><span>{{ site.role }}</span></h1>
    </section>

    <section class="columns">
      <div class="bio">
        <p v-for="(para, i) in site.about" :key="i">{{ para }}</p>
      </div>

      <div class="lists">
        <div>
          <h2 class="eyebrow">Services</h2>
          <ul><li v-for="s in site.services" :key="s">{{ s }}</li></ul>
        </div>
        <div>
          <h2 class="eyebrow">Clients</h2>
          <ul><li v-for="c in site.clients" :key="c">{{ c }}</li></ul>
        </div>
      </div>
    </section>

    <section class="contact">
      <h2 class="eyebrow">Contact</h2>
      <a class="email" :href="`mailto:${site.email}`">{{ site.email }}</a>
      <ul class="socials">
        <li v-for="s in site.socials" :key="s.url">
          <a :href="s.url" target="_blank" rel="noopener">{{ s.label }} ↗</a>
        </li>
      </ul>
      <p class="location">{{ site.location }}</p>
    </section>

    <footer class="credits">
      <p>Built with Nuxt and Three.js. Move your cursor around this page.</p>
    </footer>
  </main>
</template>

<style scoped>
.about {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  background: var(--bg);
  padding: calc(var(--gutter) * 5) var(--gutter) calc(var(--gutter) * 2 + env(safe-area-inset-bottom));
  overflow: hidden;
}
.about > section,
.about > footer {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}
.intro h1 {
  margin: 0.5rem 0 0;
  font-size: clamp(3rem, 11vw, 10rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.88;
  animation: rise 1s var(--ease) both;
}
.intro h1 span {
  opacity: 0.45;
}
.columns {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: clamp(2rem, 6vw, 6rem);
  margin-top: clamp(3rem, 10vw, 8rem);
}
.bio p {
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  line-height: 1.3;
  letter-spacing: -0.015em;
  margin: 0 0 1.4rem;
}
.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.lists ul,
.socials {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}
.lists li {
  padding: 0.45rem 0;
  border-top: 1px solid var(--line);
}
.contact {
  margin-top: clamp(4rem, 12vw, 10rem);
}
.email {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: clamp(2rem, 7vw, 6rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 2px no-repeat;
  transition: background-size 0.6s var(--ease);
  word-break: break-all;
}
.email:hover {
  background-size: 100% 2px;
}
.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}
.socials a {
  opacity: 0.7;
  transition: opacity 0.3s;
}
.socials a:hover { opacity: 1; }
.location {
  margin-top: 1rem;
  opacity: 0.5;
}
.credits {
  margin-top: clamp(4rem, 10vw, 8rem);
  font-size: 0.8rem;
  opacity: 0.45;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 800px) {
  .columns { grid-template-columns: 1fr; }
}
@media (hover: none) {
  .credits p { display: none; }
}
</style>
