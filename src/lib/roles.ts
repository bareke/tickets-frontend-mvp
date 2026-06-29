import type { UserRole } from '@/types/api'

const roleLabels: Record<UserRole, string> = {
  buyer: 'Comprador',
  seller: 'Vendedor',
  admin: 'Administrador',
}

const roleBadgeVariants: Record<UserRole, 'default' | 'secondary' | 'destructive'> = {
  buyer: 'secondary',
  seller: 'default',
  admin: 'destructive',
}

export function roleLabel(role: UserRole): string {
  return roleLabels[role] ?? role
}

export function roleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' {
  return roleBadgeVariants[role] ?? 'secondary'
}
