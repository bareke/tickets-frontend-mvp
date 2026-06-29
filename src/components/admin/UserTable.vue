<template>
  <div>
    <div v-if="loading" class="space-y-3">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
    </div>

    <Alert v-else-if="error" variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <div v-else-if="users.length === 0" class="py-12 text-center text-muted-foreground">
      No hay usuarios registrados
    </div>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead class="w-16">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Creado</TableHead>
          <TableHead class="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell class="font-mono text-xs">{{ user.id }}</TableCell>
          <TableCell class="font-medium">{{ user.name }} {{ user.lastname }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="role in user.roles"
                :key="role"
                :variant="roleBadgeVariant(role)"
              >
                {{ roleLabel(role) }}
              </Badge>
            </div>
          </TableCell>
          <TableCell class="text-muted-foreground text-sm">
            {{ formatDate(user.created_at) }}
          </TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="icon" @click="$emit('edit', user)">
                <Pencil class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="$emit('delete', user)">
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Pencil, Trash2 } from '@lucide/vue'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import type { User, UserRole } from '@/types/api'

defineProps<{
  users: User[]
  loading: boolean
  error: string | null
}>()

defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

function roleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    admin: 'Administrador',
  }
  return labels[role] ?? role
}

function roleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' {
  const variants: Record<UserRole, 'default' | 'secondary' | 'destructive'> = {
    buyer: 'secondary',
    seller: 'default',
    admin: 'destructive',
  }
  return variants[role] ?? 'secondary'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'dd/MM/yyyy', { locale: es })
}
</script>
