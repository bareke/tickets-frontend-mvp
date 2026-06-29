<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r bg-background transition-transform duration-200 md:static md:translate-x-0"
    :class="{ 'translate-x-0': open }"
  >
    <div class="flex h-full flex-col">
      <div class="flex h-16 items-center justify-between border-b px-4">
        <router-link to="/" class="text-lg font-semibold">Tickets</router-link>
        <Button variant="ghost" size="icon" class="md:hidden" @click="$emit('close')">
          <X class="h-5 w-5" />
        </Button>
      </div>
      <nav class="flex-1 space-y-1 p-4">
        <router-link
          to="/profile"
          class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
          active-class="bg-muted font-medium"
        >
          <User class="h-4 w-4" />
          Perfil
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/admin/users"
          class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
          active-class="bg-muted font-medium"
        >
          <Users class="h-4 w-4" />
          Usuarios
        </router-link>
      </nav>
    </div>
  </aside>

  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
import { User, Users, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'

defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()

const { isAdmin } = useAuth()
</script>
