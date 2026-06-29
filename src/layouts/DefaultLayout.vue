<template>
  <div class="min-h-screen bg-background md:flex">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex flex-1 flex-col">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppSidebar from '@/components/shared/AppSidebar.vue'

const sidebarOpen = ref(false)
</script>
