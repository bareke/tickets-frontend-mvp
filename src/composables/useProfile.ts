import { toRef } from 'vue'
import { useProfileStore } from '@/stores/profile'

export function useProfile() {
  const store = useProfileStore()

  return {
    profile: toRef(store, 'profile'),
    loading: toRef(store, 'loading'),
    error: toRef(store, 'error'),
    uploadProgress: toRef(store, 'uploadProgress'),
    fetchProfile: store.fetchProfile,
    updateProfile: store.updateProfile,
    uploadAvatar: store.uploadAvatar,
    addRole: store.addRole,
    clearError: store.clearError,
  }
}
