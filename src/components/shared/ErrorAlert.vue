<template>
  <Alert v-if="visible" :variant="variant">
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription v-if="message">
      {{ message }}
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  variant?: 'destructive' | 'default'
}>(), {
  variant: 'destructive',
})

const visible = computed(() => !!props.title || !!props.message)
</script>
