import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import * as authApi from '@/api/auth'
import { getApiError } from '@/lib/api-error'
import type { User, RegisterRequest, LoginRequest, UserRole, JwtPayload } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    if (!token.value) return false
    try {
      const decoded = jwtDecode<JwtPayload>(token.value)
      return decoded.exp * 1000 > Date.now()
    } catch {
      return false
    }
  })

  const userRoles = computed<UserRole[]>(() => user.value?.roles ?? [])
  const isAdmin = computed(() => userRoles.value.includes('admin'))
  const isSeller = computed(() => userRoles.value.includes('seller'))
  const isEmailVerified = computed(() => user.value?.email_verified ?? false)

  function _setSession(t: string) {
    token.value = t
    localStorage.setItem('auth_token', t)
    const decoded = jwtDecode<JwtPayload>(t)
    user.value = {
      id: parseInt(decoded.sub),
      email: decoded.email,
      roles: decoded.roles as UserRole[],
      name: '',
      lastname: '',
      email_verified: true,
      phone: null,
      avatar_url: null,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }
  }

  function _clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function register(data: RegisterRequest) {
    error.value = null
    loading.value = true
    try {
      await authApi.register(data)
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      if (detail === 'Email already registered') {
        error.value = 'Este email ya está registrado'
      } else {
        error.value = detail ?? 'Error al registrarse'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(data: LoginRequest) {
    error.value = null
    loading.value = true
    try {
      const res = await authApi.login(data)
      _setSession(res.access_token)
    } catch (err: unknown) {
      const { detail, status } = getApiError(err)
      if (status === 401) {
        error.value = 'Credenciales inválidas'
      } else if (status === 403) {
        error.value = 'Email no verificado'
      } else {
        error.value = detail ?? 'Error al iniciar sesión'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    error.value = null
    try {
      await authApi.logout()
    } catch {
      // best-effort: limpiamos sesión igual
    } finally {
      _clearSession()
    }
  }

  async function verifyEmail(tokenStr: string) {
    error.value = null
    loading.value = true
    try {
      const res = await authApi.verifyEmail(tokenStr)
      return res
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      error.value = detail ?? 'Token inválido o expirado'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resendVerification(email: string) {
    error.value = null
    loading.value = true
    try {
      const res = await authApi.resendVerification(email)
      return res
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      if (detail === 'Email already verified') {
        error.value = 'El email ya está verificado'
      } else {
        error.value = detail ?? 'Error al reenviar verificación'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string) {
    error.value = null
    loading.value = true
    try {
      const res = await authApi.forgotPassword({ email })
      return res
    } catch (err: unknown) {
      error.value = 'Error al solicitar recuperación'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(tokenStr: string, newPassword: string) {
    error.value = null
    loading.value = true
    try {
      const res = await authApi.resetPassword({ token: tokenStr, new_password: newPassword })
      return res
    } catch (err: unknown) {
      const { detail } = getApiError(err)
      error.value = detail ?? 'Error al restablecer contraseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  function checkAuth() {
    if (!token.value) {
      _clearSession()
      return
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token.value)
      if (decoded.exp * 1000 <= Date.now()) {
        _clearSession()
      }
    } catch {
      _clearSession()
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    token, user, loading, error,
    isAuthenticated, userRoles, isAdmin, isSeller, isEmailVerified,
    register, login, logout, verifyEmail, resendVerification,
    forgotPassword, resetPassword, checkAuth, clearError,
  }
})
