<template>
  <DefaultLayout>
    <div class="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p class="text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <LoadingSpinner v-if="loading && !profile" size="lg" />

      <ErrorAlert
        v-if="error && !profile"
        title="Error al cargar perfil"
        :message="error"
      />

      <template v-if="profile">
        <ProfileCard :user="profile" />

        <Card>
          <CardHeader>
            <CardTitle>Editar perfil</CardTitle>
            <CardDescription>Actualiza tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileEditForm
              v-if="!editingSuccess"
              :key="editingKey"
              :user="profile"
              @saved="onProfileSaved"
              @cancelled="editingSuccess = false"
            />
            <Alert v-else variant="default">
              <AlertTitle>Perfil actualizado</AlertTitle>
              <AlertDescription>
                Tus datos se han guardado correctamente.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Foto de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              :current-avatar-url="profile.avatar_url ?? undefined"
              @uploaded="onAvatarUploaded"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Tus permisos en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSelector
              :current-roles="profile.roles"
              @role-added="onRoleAdded"
            />
          </CardContent>
        </Card>
      </template>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue'
import AvatarUpload from '@/components/profile/AvatarUpload.vue'
import RoleSelector from '@/components/profile/RoleSelector.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'
import type { User, UserRole } from '@/types/api'

const { profile, loading, error, fetchProfile } = useProfile()
const { toast } = useToast()

const editingKey = ref(0)
const editingSuccess = ref(false)

onMounted(async () => {
  if (!profile.value) {
    try {
      await fetchProfile()
    } catch {
      // error ya se muestra via ErrorAlert
    }
  }
})

function onProfileSaved(user: User) {
  profile.value = user
  editingSuccess.value = true
  toast.success('Perfil actualizado correctamente')
}

function onAvatarUploaded(url: string) {
  if (profile.value) {
    profile.value = { ...profile.value, avatar_url: url }
  }
  toast.success('Avatar actualizado')
}

function onRoleAdded(roles: UserRole[]) {
  if (profile.value) {
    profile.value = { ...profile.value, roles }
  }
  toast.success('Rol añadido correctamente')
}
</script>
