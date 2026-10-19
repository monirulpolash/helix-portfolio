<script setup lang="ts">
// Same as the original MenuOverlay: a blurred dark layer behind the open menu; clicking it closes the menu.
defineEmits<{ click: [] }>()
</script>

<template>
  <div class="overlay" @click="$emit('click')" />
</template>

<style scoped>
/* layout from the original MenuOverlay component */
.overlay {
  -webkit-backdrop-filter: blur(1rem);
  backdrop-filter: blur(1rem);
  background: #00000080;
  height: 100dvh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 10;
}
</style>
