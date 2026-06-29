import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/admin'

export function useUsers() {
  const store = useAdminStore()
  const { users, selectedUser, loading, error } = storeToRefs(store)

  return {
    users, selectedUser, loading, error,
    fetchUsers: store.fetchUsers,
    fetchUser: store.fetchUser,
    createUser: store.createUser,
    updateUser: store.updateUser,
    deleteUser: store.deleteUser,
    clearError: store.clearError,
  }
}
