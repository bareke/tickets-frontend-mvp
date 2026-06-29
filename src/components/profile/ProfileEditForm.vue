<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Nombre</Label>
      <Input id="name" v-model="form.name" placeholder="Tu nombre" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="lastname">Apellido</Label>
      <Input id="lastname" v-model="form.lastname" placeholder="Tu apellido" />
      <p v-if="errors.lastname" class="text-sm text-destructive">{{ errors.lastname }}</p>
    </div>

    <div class="space-y-2">
      <Label for="phone">Teléfono</Label>
      <Input id="phone" v-model="form.phone" placeholder="+56912345678" />
      <p v-if="errors.phone" class="text-sm text-destructive">{{ errors.phone }}</p>
    </div>

    <div class="flex gap-2">
      <Button type="submit" :disabled="submitting">
        <LoadingSpinner v-if="submitting" size="sm" class="mr-2" />
        Guardar
      </Button>
      <Button type="button" variant="outline" @click="$emit('cancelled')">
        Cancelar
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import { updateProfileSchema } from '@/lib/validators'
import { useProfile } from '@/composables/useProfile'
import type { User } from '@/types/api'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  saved: [user: User]
  cancelled: []
}>()

const { updateProfile } = useProfile()
const submitting = ref(false)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  name: props.user.name,
  lastname: props.user.lastname,
  phone: props.user.phone ?? '',
})

async function handleSubmit() {
  errors.name = ''
  errors.lastname = ''
  errors.phone = ''

  const result = updateProfileSchema.safeParse({
    name: form.name,
    lastname: form.lastname,
    phone: form.phone || undefined,
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
    const updated = await updateProfile({
      name: form.name || undefined,
      lastname: form.lastname || undefined,
      phone: form.phone || undefined,
    })
    emit('saved', updated)
  } catch {
    // error manejado en el store
  } finally {
    submitting.value = false
  }
}
</script>
