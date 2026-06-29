<template>
  <div class="min-h-screen bg-background">
    <AppHeader />
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue'
</script>
