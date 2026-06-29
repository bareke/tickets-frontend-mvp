import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/profile'

export function useProfile() {
  const store = useProfileStore()
  const { profile, loading, error, uploadProgress } = storeToRefs(store)

  return {
    profile, loading, error, uploadProgress,
    fetchProfile: store.fetchProfile,
    updateProfile: store.updateProfile,
    uploadAvatar: store.uploadAvatar,
    addRole: store.addRole,
    clearError: store.clearError,
  }
}
