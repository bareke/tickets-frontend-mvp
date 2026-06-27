import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[a-z]/, 'Debe contener una minúscula')
    .regex(/\d/, 'Debe contener un dígito'),
  name: z.string().min(1, 'Nombre requerido'),
  lastname: z.string().min(1, 'Apellido requerido'),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, 'Debe tener 7-15 dígitos')
    .optional()
    .or(z.literal('')),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, 'Debe tener 7-15 dígitos')
    .optional()
    .or(z.literal('')),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  newPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[a-z]/, 'Debe contener una minúscula')
    .regex(/\d/, 'Debe contener un dígito'),
})

export const addRoleSchema = z.object({
  role: z.enum(['buyer', 'seller', 'admin']),
})

export type RegisterForm = z.infer<typeof registerSchema>
export type LoginForm = z.infer<typeof loginSchema>
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
