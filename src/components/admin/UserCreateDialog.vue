<template>
  <Dialog :open="open" @update:open="$emit('closed')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Crear usuario</DialogTitle>
        <DialogDescription>
          Ingresa los datos del nuevo usuario
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="create-email">Email</Label>
          <Input id="create-email" v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
          <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <Label for="create-password">Contraseña</Label>
          <Input id="create-password" v-model="form.password" type="password" />
          <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label for="create-name">Nombre</Label>
            <Input id="create-name" v-model="form.name" />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </div>
          <div class="space-y-2">
            <Label for="create-lastname">Apellido</Label>
            <Input id="create-lastname" v-model="form.lastname" />
            <p v-if="errors.lastname" class="text-sm text-destructive">{{ errors.lastname }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="create-role">Rol</Label>
          <Select v-model="form.role">
            <SelectTrigger id="create-role">
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
            {{ submitting ? 'Creando...' : 'Crear' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { registerSchema } from '@/lib/validators'
import { useUsers } from '@/composables/useUsers'
import { getApiError } from '@/lib/api-error'
import type { User, UserRole } from '@/types/api'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  created: [user: User]
  closed: []
}>()

const { createUser } = useUsers()
const submitting = ref(false)
const apiError = ref('')
const errors = reactive<Record<string, string>>({})

const form = reactive({
  email: '',
  password: '',
  name: '',
  lastname: '',
  role: 'buyer' as UserRole,
})

async function handleSubmit() {
  errors.email = ''
  errors.password = ''
  errors.name = ''
  errors.lastname = ''
  apiError.value = ''

  const result = registerSchema.safeParse({
    email: form.email,
    password: form.password,
    name: form.name,
    lastname: form.lastname,
  })

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      errors[field] = issue.message
    }
    return
  }

  submitting.value = true
  try {
    const user = await createUser({
      email: form.email,
      password: form.password,
      name: form.name,
      lastname: form.lastname,
      role: form.role,
    })
    emit('created', user)
  } catch (err: unknown) {
    const { detail } = getApiError(err)
    apiError.value = detail ?? 'Error al crear usuario'
  } finally {
    submitting.value = false
  }
}
</script>
