<template>
  <AuthLayout>
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Verifica tu email</CardTitle>
        <CardDescription>
          Te hemos enviado un enlace de verificación a tu correo electrónico.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <ErrorAlert v-if="resendMessage" title="Email enviado" :message="resendMessage" />
        <ErrorAlert v-if="authError" :message="authError" />

        <Button class="w-full" :disabled="loading" @click="handleResend">
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>Reenviar email de verificación</span>
        </Button>

        <p class="text-center text-sm text-muted-foreground">
          ¿Ya verificaste?
          <router-link to="/login" class="text-primary hover:underline">
            Inicia sesión
          </router-link>
        </p>
      </CardContent>
    </Card>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import { useAuth } from '@/composables/useAuth'

const { verifyEmail, resendVerification, loading, error: authError, clearError } = useAuth()
const route = useRoute()
const resendMessage = ref<string | null>(null)

onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    try {
      await verifyEmail(token)
      resendMessage.value = 'Email verificado exitosamente. Ya puedes iniciar sesión.'
    } catch {
      // error en store
    }
  }
})

async function handleResend() {
  clearError()
  resendMessage.value = null
  try {
    await resendVerification('')
  } catch {
    // error en store
  }
}
</script>
