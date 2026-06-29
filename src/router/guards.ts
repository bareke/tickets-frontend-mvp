import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/types/api'

export function requiresAuth() {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return { name: 'login' }
  }
}

export function requiresGuest() {
  const token = localStorage.getItem('auth_token')
  if (token) {
    return { name: 'profile' }
  }
}

export function requiresAdmin() {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return { name: 'login' }
  }
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded.roles?.includes('admin')) {
      return { name: 'profile' }
    }
  } catch {
    return { name: 'login' }
  }
}
