<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" placeholder="user@example.com" required />
    </div>

    <ErrorAlert v-if="sent" title="Email enviado" message="Si el email existe, recibirás un enlace para restablecer tu contraseña." />
    <ErrorAlert v-if="authError" :message="authError" />

    <Button v-if="!sent" type="submit" class="w-full" :disabled="submitting">
      <LoadingSpinner v-if="submitting" size="sm" />
      <span v-else>Enviar enlace</span>
    </Button>

    <p class="text-center text-sm text-muted-foreground">
      <router-link to="/login" class="text-primary hover:underline">
        Volver al inicio de sesión
      </router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import { useAuth } from '@/composables/useAuth'

const { forgotPassword, error: authError, clearError } = useAuth()
const email = ref('')
const submitting = ref(false)
const sent = ref(false)

async function onSubmit() {
  clearError()
  submitting.value = true
  try {
    await forgotPassword(email.value)
    sent.value = true
  } catch {
    // error en store
  } finally {
    submitting.value = false
  }
}
</script>
