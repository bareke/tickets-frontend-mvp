<template>
  <Card>
    <CardHeader class="flex flex-row items-center gap-4">
      <div
        class="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary"
      >
        <img
          v-if="user.avatar_url"
          :src="user.avatar_url"
          :alt="user.name"
          class="h-full w-full rounded-full object-cover"
        />
        <span v-else>{{ initials }}</span>
      </div>
      <div class="flex-1">
        <CardTitle class="text-xl">{{ fullName }}</CardTitle>
        <CardDescription class="flex items-center gap-1">
          <Mail class="h-3.5 w-3.5" />
          {{ user.email }}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="role in user.roles"
          :key="role"
          :variant="roleBadgeVariant(role)"
        >
          {{ roleLabel(role) }}
        </Badge>
      </div>

      <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar class="h-3.5 w-3.5" />
        Miembro desde {{ memberSince }}
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Calendar } from '@lucide/vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { User, UserRole } from '@/types/api'

const props = defineProps<{
  user: User
}>()

const fullName = computed(() => `${props.user.name} ${props.user.lastname}`)

const initials = computed(() => {
  const first = props.user.name?.charAt(0) ?? ''
  const last = props.user.lastname?.charAt(0) ?? ''
  return (first + last).toUpperCase()
})

const memberSince = computed(() => {
  if (!props.user.created_at) return ''
  return format(new Date(props.user.created_at), 'MMMM yyyy', { locale: es })
})

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
</script>
