<template>
  <DefaultLayout>
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p class="text-muted-foreground">Administración de usuarios del sistema</p>
        </div>
        <Button @click="openCreate = true">
          <Plus class="mr-1.5 h-4 w-4" />
          Crear usuario
        </Button>
      </div>

      <UserTable
        :users="users"
        :loading="loading"
        :error="error"
        @edit="onEdit"
        @delete="onDelete"
      />

      <UserCreateDialog
        :open="openCreate"
        @created="onCreated"
        @closed="openCreate = false"
      />

      <UserEditDialog
        :open="openEdit"
        :user="editingUser"
        @updated="onUpdated"
        @closed="onEditClosed"
      />

      <Dialog :open="openDelete" @update:open="openDelete = $event">
        <DialogContent class="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El usuario será desactivado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="openDelete = false">Cancelar</Button>
            <Button variant="destructive" :disabled="deleting" @click="confirmDelete">
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus } from '@lucide/vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import UserTable from '@/components/admin/UserTable.vue'
import UserCreateDialog from '@/components/admin/UserCreateDialog.vue'
import UserEditDialog from '@/components/admin/UserEditDialog.vue'
import { useUsers } from '@/composables/useUsers'
import type { User } from '@/types/api'

const { users, loading, error, fetchUsers, deleteUser } = useUsers()

const openCreate = ref(false)
const openEdit = ref(false)
const openDelete = ref(false)
const editingUser = ref<User | null>(null)
const deletingUser = ref<User | null>(null)
const deleting = ref(false)

onMounted(() => {
  fetchUsers()
})

function onEdit(user: User) {
  editingUser.value = user
  openEdit.value = true
}

function onCreated() {
  openCreate.value = false
}

function onUpdated() {
  openEdit.value = false
  editingUser.value = null
}

function onEditClosed() {
  openEdit.value = false
  editingUser.value = null
}

function onDelete(user: User) {
  deletingUser.value = user
  openDelete.value = true
}

async function confirmDelete() {
  if (!deletingUser.value) return
  deleting.value = true
  try {
    await deleteUser(deletingUser.value.id)
    openDelete.value = false
    deletingUser.value = null
  } catch {
    // error manejado en store
  } finally {
    deleting.value = false
  }
}
</script>
