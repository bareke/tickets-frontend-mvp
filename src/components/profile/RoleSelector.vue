<template>
  <div class="space-y-3">
    <Label>Roles</Label>

    <div class="flex flex-wrap gap-1.5">
      <Badge
        v-for="role in currentRoles"
        :key="role"
        :variant="roleBadgeVariant(role)"
      >
        {{ roleLabel(role) }}
      </Badge>
    </div>

    <div v-if="!hasSellerRole">
      <Dialog v-model:open="confirmOpen">
        <DialogTrigger as-child>
          <Button variant="outline" size="sm">
            Convertirse en vendedor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Convertirse en vendedor?</DialogTitle>
            <DialogDescription>
              Como vendedor podrás publicar tickets para la venta.
              Esta acción no se puede deshacer fácilmente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="confirmOpen = false">
              Cancelar
            </Button>
            <Button :disabled="adding" @click="handleAddRole">
              {{ adding ? 'Añadiendo...' : 'Sí, convertirme' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <p v-else class="text-sm text-muted-foreground">Ya eres vendedor</p>

    <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { roleLabel, roleBadgeVariant } from '@/lib/roles'
import { useProfile } from '@/composables/useProfile'
import type { UserRole } from '@/types/api'

const props = defineProps<{
  currentRoles: UserRole[]
}>()

const emit = defineEmits<{
  roleAdded: [roles: UserRole[]]
}>()

const { addRole } = useProfile()

const confirmOpen = ref(false)
const adding = ref(false)
const errorMsg = ref('')

const hasSellerRole = computed(() => props.currentRoles.includes('seller'))

async function handleAddRole() {
  adding.value = true
  errorMsg.value = ''
  try {
    const res = await addRole('seller')
    emit('roleAdded', res.roles)
    confirmOpen.value = false
  } catch {
    errorMsg.value = 'Error al añadir el rol'
  } finally {
    adding.value = false
  }
}
</script>
