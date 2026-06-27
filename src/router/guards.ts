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
