<template>
  <RouterView />
  <Toaster richColors closeButton />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>
