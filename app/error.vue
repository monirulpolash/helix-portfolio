<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
useHead({ title: props.error?.statusCode === 404 ? 'Not found' : 'Error' })
const home = () => clearError({ redirect: '/' })
</script>

<template>
  <main class="error-page">
    <p class="eyebrow">{{ error?.statusCode || 'Error' }}</p>
    <h1>{{ error?.statusCode === 404 ? 'This page does not exist.' : 'Something went wrong.' }}</h1>
    <button type="button" class="pill" @click="home">Back to the work</button>
  </main>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 1.5rem;
  padding: var(--gutter);
  text-align: center;
}
h1 {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}
</style>
