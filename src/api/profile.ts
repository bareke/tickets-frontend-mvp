import client from './client'
import type {
  User,
  UpdateProfileRequest,
  AddRoleRequest,
  AvatarResponse,
  RolesResponse,
} from '@/types/api'

export function getProfile(): Promise<User> {
  return client.get('/users/me').then((r) => r.data)
}

export function updateProfile(data: UpdateProfileRequest): Promise<User> {
  return client.patch('/users/me', data).then((r) => r.data)
}

export function uploadAvatar(file: File): Promise<AvatarResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return client
    .post('/users/me/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}

export function addRole(data: AddRoleRequest): Promise<RolesResponse> {
  return client.post('/users/me/roles', data).then((r) => r.data)
}
