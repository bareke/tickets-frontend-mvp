import client from './client'
import type {
  User,
  RegisterRequest,
  UserRole,
} from '@/types/api'

export function getUsers(): Promise<User[]> {
  return client.get('/users').then((r) => r.data)
}

export function getUser(id: number): Promise<User> {
  return client.get(`/users/${id}`).then((r) => r.data)
}

export function createUser(data: RegisterRequest & { role: UserRole }): Promise<User> {
  return client.post('/users', data).then((r) => r.data)
}

export function updateUser(id: number, data: Partial<User>): Promise<User> {
  return client.put(`/users/${id}`, data).then((r) => r.data)
}

export function deleteUser(id: number): Promise<void> {
  return client.delete(`/users/${id}`).then((r) => r.data)
}
