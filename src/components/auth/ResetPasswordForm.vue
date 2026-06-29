<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="newPassword">Nueva contraseña</Label>
      <Input id="newPassword" v-model="newPassword" type="password" required />
      <p v-if="errors.newPassword" class="text-sm text-destructive">{{ errors.newPassword }}</p>
    </div>
    <div class="space-y-2">
      <Label for="confirmPassword">Confirmar contraseña</Label>
      <Input id="confirmPassword" v-model="confirmPassword" type="password" required />
      <p v-if="errors.confirmPassword" class="text-sm text-destructive">{{ errors.confirmPassword }}</p>
    </div>

    <ErrorAlert v-if="successMessage" title="Contraseña actualizada" :message="successMessage" />
    <ErrorAlert v-if="authError" :message="authError" />

    <Button v-if="!done" type="submit" class="w-full" :disabled="submitting">
      <LoadingSpinner v-if="submitting" size="sm" />
      <span v-else>Restablecer contraseña</span>
    </Button>

    <p v-if="done" class="text-center text-sm text-muted-foreground">
      <router-link to="/login" class="text-primary hover:underline">
        Iniciar sesión
      </router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import { useAuth } from '@/composables/useAuth'
import { resetPasswordSchema } from '@/lib/validators'

const props = defineProps<{ token: string }>()

const { resetPassword, error: authError, clearError } = useAuth()

const newPassword = ref('')
const confirmPassword = ref('')
const errors = reactive<Record<string, string>>({})
const submitting = ref(false)
const done = ref(false)

const successMessage = ref('')

async function onSubmit() {
  clearError()
  errors.newPassword = ''
  errors.confirmPassword = ''

  if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    return
  }

  const result = resetPasswordSchema.safeParse({ token: props.token, newPassword: newPassword.value })
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      errors[field] = field === 'newPassword' ? issue.message : issue.message
    }
    return
  }

  submitting.value = true
  try {
    const res = await resetPassword(props.token, newPassword.value)
    successMessage.value = res.message || 'Contraseña restablecida exitosamente'
    done.value = true
  } catch {
    // error en store
  } finally {
    submitting.value = false
  }
}
</script>
