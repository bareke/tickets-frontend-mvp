<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" v-model="data.email" type="email" placeholder="user@example.com" required />
      <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
    </div>
    <div class="space-y-2">
      <Label for="password">Contraseña</Label>
      <Input id="password" v-model="data.password" type="password" required />
      <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
    </div>

    <ErrorAlert v-if="authError" :message="authError" />

    <Button type="submit" class="w-full" :disabled="submitting">
      <LoadingSpinner v-if="submitting" size="sm" />
      <span v-else>Iniciar sesión</span>
    </Button>

    <div class="flex justify-between text-sm">
      <router-link to="/register" class="text-muted-foreground hover:text-foreground">
        Crear cuenta
      </router-link>
      <router-link to="/forgot-password" class="text-muted-foreground hover:text-foreground">
        Olvidé mi contraseña
      </router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import { useAuth } from '@/composables/useAuth'
import { loginSchema } from '@/lib/validators'

const { login, error: authError, clearError } = useAuth()
const router = useRouter()

const data = reactive({ email: '', password: '' })
const errors = reactive<Record<string, string>>({})
const submitting = ref(false)

async function onSubmit() {
  clearError()
  errors.email = ''
  errors.password = ''

  const result = loginSchema.safeParse(data)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      errors[field] = issue.message
    }
    return
  }

  submitting.value = true
  try {
    await login(data)
    router.push('/profile')
  } catch {
    // error se setea en el store
  } finally {
    submitting.value = false
  }
}
</script>
