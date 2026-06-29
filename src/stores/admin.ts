import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as usersApi from '@/api/users'
import type { User, RegisterRequest, UserRole } from '@/types/api'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    error.value = null
    loading.value = true
    try {
      const data = await usersApi.getUsers()
      users.value = data
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      error.value = typeof detail === 'string' ? detail : 'Error al obtener usuarios'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: number) {
    error.value = null
    loading.value = true
    try {
      const data = await usersApi.getUser(id)
      selectedUser.value = data
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (err?.response?.status === 404) {
        error.value = 'Usuario no encontrado'
      } else {
        error.value = typeof detail === 'string' ? detail : 'Error al obtener usuario'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: RegisterRequest & { role: UserRole }) {
    error.value = null
    loading.value = true
    try {
      const newUser = await usersApi.createUser(data)
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      const status = err?.response?.status
      const detail = err?.response?.data?.detail
      if (status === 409) {
        error.value = 'El email ya está registrado'
      } else {
        error.value = typeof detail === 'string' ? detail : 'Error al crear usuario'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: number, data: Partial<User>) {
    error.value = null
    loading.value = true
    try {
      const updated = await usersApi.updateUser(id, data)
      const idx = users.value.findIndex((u) => u.id === id)
      if (idx !== -1) {
        users.value[idx] = updated
      }
      if (selectedUser.value?.id === id) {
        selectedUser.value = updated
      }
      return updated
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (err?.response?.status === 404) {
        error.value = 'Usuario no encontrado'
      } else {
        error.value = typeof detail === 'string' ? detail : 'Error al actualizar usuario'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: number) {
    error.value = null
    loading.value = true
    try {
      await usersApi.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
      if (selectedUser.value?.id === id) {
        selectedUser.value = null
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (err?.response?.status === 404) {
        error.value = 'Usuario no encontrado'
      } else {
        error.value = typeof detail === 'string' ? detail : 'Error al eliminar usuario'
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
    users, selectedUser, loading, error,
    fetchUsers, fetchUser, createUser, updateUser, deleteUser, clearError,
  }
})
