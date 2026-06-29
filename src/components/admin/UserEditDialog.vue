<template>
  <Dialog :open="open" @update:open="$emit('closed')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogDescription>
          Modifica los datos del usuario
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="edit-email">Email</Label>
          <Input id="edit-email" v-model="form.email" type="email" />
        </div>

        <div class="space-y-2">
          <Label for="edit-password">Nueva contraseña (opcional)</Label>
          <Input id="edit-password" v-model="form.password" type="password" placeholder="Dejar vacío para no cambiar" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label for="edit-name">Nombre</Label>
            <Input id="edit-name" v-model="form.name" />
          </div>
          <div class="space-y-2">
            <Label for="edit-lastname">Apellido</Label>
            <Input id="edit-lastname" v-model="form.lastname" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="edit-role">Rol</Label>
          <Select v-model="form.role">
            <SelectTrigger id="edit-role">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Comprador</SelectItem>
              <SelectItem value="seller">Vendedor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p v-if="apiError" class="text-sm text-destructive">{{ apiError }}</p>

        <DialogFooter>
          <Button variant="outline" type="button" @click="$emit('closed')">
            Cancelar
          </Button>
          <Button type="submit" :disabled="submitting">
            {{ submitting ? 'Guardando...' : 'Guardar' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { useUsers } from '@/composables/useUsers'
import type { User, UserRole } from '@/types/api'

const props = defineProps<{
  open: boolean
  user: User | null
}>()

const emit = defineEmits<{
  updated: [user: User]
  closed: []
}>()

const { updateUser } = useUsers()
const submitting = ref(false)
const apiError = ref('')

const form = reactive({
  email: '',
  password: '',
  name: '',
  lastname: '',
  role: 'buyer' as UserRole,
})

watch(() => props.user, (user) => {
  if (user) {
    form.email = user.email
    form.password = ''
    form.name = user.name
    form.lastname = user.lastname
    form.role = user.roles.includes('admin') ? 'admin' : user.roles.includes('seller') ? 'seller' : 'buyer'
  }
}, { immediate: true })

async function handleSubmit() {
  apiError.value = ''

  const payload: Record<string, any> = {}
  if (form.email) payload.email = form.email
  if (form.name) payload.name = form.name
  if (form.lastname) payload.lastname = form.lastname
  if (form.password) payload.password = form.password
  if (form.role) payload.roles = [form.role]

  submitting.value = true
  try {
    if (!props.user) return
    const updated = await updateUser(props.user.id, payload)
    emit('updated', updated)
  } catch (err: any) {
    const detail = err?.response?.data?.detail
    apiError.value = typeof detail === 'string' ? detail : 'Error al actualizar usuario'
  } finally {
    submitting.value = false
  }
}
</script>
