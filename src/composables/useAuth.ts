import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const {
    token, user, loading, error,
    isAuthenticated, userRoles, isAdmin, isEmailVerified,
  } = storeToRefs(store)

  return {
    token, user, loading, error,
    isAuthenticated, userRoles, isAdmin, isEmailVerified,
    register: store.register,
    login: store.login,
    logout: store.logout,
    verifyEmail: store.verifyEmail,
    resendVerification: store.resendVerification,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
  }
}
