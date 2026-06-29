<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="name">Nombre</Label>
        <Input id="name" v-model="data.name" required />
        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
      </div>
      <div class="space-y-2">
        <Label for="lastname">Apellido</Label>
        <Input id="lastname" v-model="data.lastname" required />
        <p v-if="errors.lastname" class="text-sm text-destructive">{{ errors.lastname }}</p>
      </div>
    </div>
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
    <div class="space-y-2">
      <Label for="confirmPassword">Confirmar contraseña</Label>
      <Input id="confirmPassword" v-model="confirmPassword" type="password" required />
      <p v-if="errors.confirmPassword" class="text-sm text-destructive">{{ errors.confirmPassword }}</p>
    </div>
    <div class="space-y-2">
      <Label for="phone">Teléfono (opcional)</Label>
      <Input id="phone" v-model="data.phone" type="tel" placeholder="1234567890" />
      <p v-if="errors.phone" class="text-sm text-destructive">{{ errors.phone }}</p>
    </div>

    <ErrorAlert v-if="authError" :message="authError" />

    <Button type="submit" class="w-full" :disabled="submitting">
      <LoadingSpinner v-if="submitting" size="sm" />
      <span v-else>Crear cuenta</span>
    </Button>

    <p class="text-center text-sm text-muted-foreground">
      ¿Ya tienes cuenta?
      <router-link to="/login" class="text-primary hover:underline">
        Inicia sesión
      </router-link>
    </p>
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
import { registerSchema } from '@/lib/validators'

const { register, error: authError, clearError } = useAuth()
const router = useRouter()

const data = reactive({ email: '', password: '', name: '', lastname: '', phone: '' })
const confirmPassword = ref('')
const errors = reactive<Record<string, string>>({})
const submitting = ref(false)

async function onSubmit() {
  clearError()
  Object.keys(errors).forEach((k) => (errors[k] = ''))

  if (data.password !== confirmPassword.value) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    return
  }

  const result = registerSchema.safeParse(data)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      errors[field] = issue.message
    }
    return
  }

  submitting.value = true
  try {
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      lastname: data.lastname,
      ...(data.phone ? { phone: data.phone } : {}),
    }
    await register(payload)
    router.push('/verify-email')
  } catch {
    // error en store
  } finally {
    submitting.value = false
  }
}
</script>
