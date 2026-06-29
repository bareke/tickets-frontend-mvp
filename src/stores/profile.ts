import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as profileApi from '@/api/profile'
import { getApiError } from '@/lib/api-error'
import type { User, UpdateProfileRequest, UserRole } from '@/types/api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  async function fetchProfile() {
    error.value = null
    loading.value = true
    try {
      const data = await profileApi.getProfile()
      profile.value = data
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      error.value = detail ?? 'Error al obtener perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: UpdateProfileRequest) {
    error.value = null
    loading.value = true
    try {
      const updated = await profileApi.updateProfile(data)
      profile.value = updated
      return updated
    } catch (err: unknown) {
      const { detail, status } = getApiError(err)
      if (status === 422) {
        error.value = 'Teléfono inválido'
      } else {
        error.value = detail ?? 'Error al actualizar perfil'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(file: File) {
    error.value = null
    uploadProgress.value = 0
    try {
      const res = await profileApi.uploadAvatar(file)
      return res
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      error.value = detail ?? 'Error al subir avatar'
      throw err
    } finally {
      uploadProgress.value = 0
    }
  }

  async function addRole(role: UserRole) {
    error.value = null
    loading.value = true
    try {
      const res = await profileApi.addRole({ role })
      if (profile.value) {
        profile.value = { ...profile.value, roles: res.roles }
      }
      return res
    } catch (err: unknown) {
      const { detail, status } = getApiError(err)
      if (status === 409) {
        error.value = 'El rol ya está asignado'
      } else {
        error.value = detail ?? 'Error al añadir rol'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    profile, loading, error, uploadProgress,
    fetchProfile, updateProfile, uploadAvatar, addRole, clearError,
  }
})
