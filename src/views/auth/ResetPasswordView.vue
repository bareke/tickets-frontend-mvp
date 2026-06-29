<template>
  <AuthLayout>
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Restablecer contraseña</CardTitle>
        <CardDescription>Ingresa tu nueva contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm :token="token" />
      </CardContent>
    </Card>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'

const route = useRoute()
const token = computed(() => (route.query.token as string) || '')
</script>
