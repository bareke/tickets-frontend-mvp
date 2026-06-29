export type UserRole = 'buyer' | 'seller' | 'admin'

export interface JwtPayload {
  sub: string
  email: string
  roles: string[]
  exp: number
}

export interface User {
  id: number
  email: string
  name: string
  lastname: string
  roles: UserRole[]
  email_verified: boolean
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  lastname: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface UpdateProfileRequest {
  name?: string
  lastname?: string
  phone?: string
}

export interface AddRoleRequest {
  role: UserRole
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface MessageResponse {
  message: string
}

export interface RolesResponse {
  roles: UserRole[]
}

export interface AvatarResponse {
  avatar_url: string
}

export interface ApiError {
  detail: string | ValidationErrorDetail[]
}

export interface ValidationErrorDetail {
  loc: string[]
  msg: string
  type: string
}
