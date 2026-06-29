<template>
  <aside class="w-64 border-r bg-muted/30 p-4">
    <nav class="flex flex-col gap-2">
      <router-link
        to="/profile"
        class="rounded-md px-3 py-2 text-sm hover:bg-muted"
      >
        Perfil
      </router-link>
      <router-link
        v-if="isAdmin"
        to="/admin/users"
        class="rounded-md px-3 py-2 text-sm hover:bg-muted"
      >
        Usuarios
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
</script>
