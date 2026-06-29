<template>
  <header class="border-b">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <router-link to="/" class="text-lg font-semibold">
        Tickets
      </router-link>
      <nav class="flex items-center gap-4">
        <template v-if="isAuthenticated">
          <router-link to="/profile" class="text-sm text-muted-foreground hover:text-foreground">
            Perfil
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
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
