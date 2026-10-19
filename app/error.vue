<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { hover } = useBreakpoint()
const code = computed(() => String(props.error?.statusCode ?? 404))
useHead({ title: () => `${code.value} ✲ ${useRuntimeConfig().public.siteName || 'Your Name'}` })
</script>

<template>
  <BackgroundGrid />
  <div class="wrapper">
    <AboutImageTrail v-if="hover" />
    <div class="error-code">
      <span>{{ code.charAt(0) }}</span>
      <img class="logo" src="/logo-face.svg" alt="Error Code">
      <span>{{ code.charAt(2) }}</span>
    </div>
    <p>are you lost ?</p>
    <UiSolidButton label="back home" @click="clearError({ redirect: '/' })" />
    <div class="overlay" />
  </div>
</template>

<style scoped>
/* layout from the original PageSlug component */
.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  height: 100%;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
}
.wrapper p {
  font-weight: 500;
}
.wrapper .error-code,.wrapper p {
  pointer-events: none;
  position: relative;
}
.wrapper .error-code {
  display: flex;
  font-size: 200rem;
  font-style: italic;
  font-weight: 600;
  gap: 118rem;
  letter-spacing: -0.05em;
  line-height: 1;
  transform: translate(-10px);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.wrapper .error-code .logo {
  height: 156rem;
  left: 50%;
  margin: 0 var(--gap-s);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -60%);
  width: 156rem;
}
.wrapper .overlay {
  background: radial-gradient(
    circle at center,
    var(--color-bg-dark-transparent) 0,
    var(--color-bg-dark-transparent) 50%,
    var(--color-bg-dark) 100%
  );
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 50;
}
</style>
