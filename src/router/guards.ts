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
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.roles?.includes('admin')) {
      return { name: 'profile' }
    }
  } catch {
    return { name: 'login' }
  }
}
