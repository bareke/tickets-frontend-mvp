import client from './client'
import type {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
} from '@/types/api'

export function register(data: RegisterRequest): Promise<User> {
  return client.post('/auth/register', data).then((r) => r.data)
}

export function login(data: LoginRequest): Promise<TokenResponse> {
  return client.post('/auth/login', data).then((r) => r.data)
}

export function logout(): Promise<void> {
  return client.post('/auth/logout').then((r) => r.data)
}

export function verifyEmail(token: string): Promise<MessageResponse> {
  return client.get('/auth/verify-email', { params: { token } }).then((r) => r.data)
}

export function resendVerification(email: string): Promise<MessageResponse> {
  return client.post('/auth/resend-verification', { email }).then((r) => r.data)
}

export function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  return client.post('/auth/forgot-password', data).then((r) => r.data)
}

export function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  return client.post('/auth/reset-password', data).then((r) => r.data)
}
