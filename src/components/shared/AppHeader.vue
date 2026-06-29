<template>
  <header class="sticky top-0 z-20 border-b bg-background">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="icon" class="md:hidden" @click="$emit('toggleSidebar')">
          <Menu class="h-5 w-5" />
        </Button>
        <router-link to="/" class="text-lg font-semibold md:hidden">Tickets</router-link>
      </div>
      <nav class="flex items-center gap-4">
        <template v-if="isAuthenticated">
          <router-link to="/profile" class="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Perfil
          </router-link>
          <router-link v-if="isAdmin" to="/admin/users" class="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Usuarios
          </router-link>
          <Button variant="ghost" size="sm" @click="handleLogout">
            Cerrar sesión
          </Button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm text-muted-foreground hover:text-foreground">
            Iniciar sesión
          </router-link>
          <router-link to="/register">
            <Button size="sm">Registrarse</Button>
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Menu } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'

defineEmits<{
  toggleSidebar: []
}>()

const { isAuthenticated, isAdmin, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
