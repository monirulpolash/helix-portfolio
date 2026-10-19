<script setup lang="ts">
// Same as the original AboutCarousel: an endless CSS marquee (two identical rows of every
// project's 16:9 thumbnail, staggered heights by index % 4). Hover shows a dark overlay with a
// "view project" pill; clicking plays "longclick" and opens the project.
const { projects } = useContentStore()
const router = useRouter()
const audio = useAudio()
function open(slug: string) {
  audio.play('longclick')
  router.push(`/projects/${slug}`)
}
</script>

<template>
  <div class="wrapper">
    <div v-for="row in ['a', 'b']" :key="row" class="container">
      <div
        v-for="(p, i) in projects" :key="`${row}-${i}`"
        class="thumbnail" :class="`thumbnail-${i % 4}`" @click="open(p.slug)"
      >
        <img :src="p.thumbnail" :alt="p.title" loading="lazy">
        <div class="overlay"><span>view project</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>/* layout from the original AboutCarousel component */
.wrapper {
  display: flex;
  overflow-x: hidden;
  padding-block: var(--grid-margin);
  position: relative;
  width: 100vw;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.wrapper::-webkit-scrollbar {
  display: none;
}
.wrapper .container {
  align-items: flex-end;
  animation: scroll 40s linear infinite;
  display: flex;
  gap: var(--grid-gutter);
  justify-content: center;
  padding-right: var(--grid-gutter);
}
.wrapper .container .thumbnail {
  aspect-ratio: 16/9;
  border-radius: 12rem;
  cursor: pointer;
  flex: 0 0 auto;
  height: 300rem;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease;
  width: auto;
}
.wrapper .container .thumbnail img {
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  transition: transform 0.3s ease;
  width: 100%;
}
.wrapper .container .thumbnail .overlay {
  align-items: center;
  background-color: #00000080;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity 0.3s ease;
  width: 100%;
}
.wrapper .container .thumbnail .overlay span {
  background-color: var(--color-pop-green);
  border-radius: 50rem;
  color: var(--color-black);
  font-size: 18rem;
  font-weight: 500;
  opacity: 0;
  padding: 8rem 16rem;
  transform: scale(0.5);
  transition:
    transform 0.4s var(--ease-spring),
    opacity 0.4s var(--ease-spring);
}
.wrapper .container .thumbnail.thumbnail-0 {
  height: 240rem;
  margin-bottom: 20rem;
}
.wrapper .container .thumbnail.thumbnail-1 {
  height: 160rem;
  margin-bottom: 40rem;
}
.wrapper .container .thumbnail.thumbnail-2 {
  height: 300rem;
  margin-bottom: 0;
}
.wrapper .container .thumbnail.thumbnail-3 {
  height: 180rem;
  margin-bottom: 60rem;
}
.wrapper .container .thumbnail:active {
  transform: scale(0.97);
}

@media screen and (hover: hover) and (pointer: fine) {.wrapper .container .thumbnail:hover img {
    transform: scale(1.05);
  }
.wrapper .container .thumbnail:hover .overlay {
    opacity: 1;
  }
.wrapper .container .thumbnail:hover .overlay span {
    opacity: 1;
    transform: scale(1);
  }

}

@media screen and (max-width: 900px) {.wrapper .container .thumbnail.thumbnail-0 {
    height: 160rem;
    margin-bottom: 20rem;
  }
.wrapper .container .thumbnail.thumbnail-1 {
    height: 120rem;
    margin-bottom: 40rem;
  }
.wrapper .container .thumbnail.thumbnail-2 {
    height: 240rem;
    margin-bottom: 0;
  }
.wrapper .container .thumbnail.thumbnail-3 {
    height: 140rem;
    margin-bottom: 60rem;
  }

}</style>