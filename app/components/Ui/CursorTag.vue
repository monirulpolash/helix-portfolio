<script setup lang="ts">
// Same as the original UiCursorTag: a small label ("close", "play !", ...) that follows the
// mouse with a lerp (0.1) inside a wrapper element, popping in 250ms after the mouse enters
// the wrapper and hiding when it leaves.
const props = defineProps<{ wrapper: HTMLElement | null; label: string }>()

const target = { x: -100, y: -100 }
const mouse = { x: -100, y: -100 }
const pos = ref({ x: -100, y: -100 })
const visible = ref(false)
let raf = 0
let bound: HTMLElement | null = null
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function tick() {
  pos.value.x = lerp(pos.value.x, target.x, 0.1)
  pos.value.y = lerp(pos.value.y, target.y, 0.1)
  raf = requestAnimationFrame(tick)
}
function update() {
  if (!props.wrapper) return
  const r = props.wrapper.getBoundingClientRect()
  target.x = mouse.x - r.left
  target.y = mouse.y - r.top
}
const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; update() }
const onScroll = () => update()
const onEnter = () => { setTimeout(() => { visible.value = true }, 250) }
const onLeave = () => { visible.value = false }

function bind() {
  unbind()
  bound = props.wrapper
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  bound?.addEventListener('mouseenter', onEnter)
  bound?.addEventListener('mouseleave', onLeave)
  tick()
}
function unbind() {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('scroll', onScroll)
  bound?.removeEventListener('mouseenter', onEnter)
  bound?.removeEventListener('mouseleave', onLeave)
  bound = null
  cancelAnimationFrame(raf)
}

watch(() => props.wrapper, (w) => { w ? bind() : unbind() })
onMounted(() => { if (props.wrapper) { visible.value = false; bind() } })
onBeforeUnmount(unbind)
</script>

<template>
  <div
    v-if="wrapper"
    class="cursor-wrapper"
    :style="{ transform: `translate3d(${pos.x}px, ${pos.y + 30}px, 0) translate(-50%, -150%)` }"
  >
    <div class="cursor-tag" :style="{ transform: `scale(${visible ? 1 : 0})`, opacity: visible ? 1 : 0 }">{{ label }}</div>
  </div>
</template>

<style scoped>/* layout from the original UiCursorTag component */
.cursor-wrapper {
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  will-change: transform;
}
.cursor-tag {
  background-color: var(--color-pop-green);
  border-radius: 50rem;
  color: var(--color-bg-dark);
  font-size: 24rem;
  font-weight: 500;
  padding: 8rem 16rem;
  transform-origin: center;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;
  white-space: nowrap;
  will-change: transform, opacity;
}</style>
