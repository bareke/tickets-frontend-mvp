---
name: F1-auth
description: "Use when implementing Fase 1: authentication module — register, login, email verification, password recovery, logout. Includes API layer, Pinia store, composables, layouts, views, auth components, and router guards."
---

# Fase 1 — Autenticación (Auth Module)

Lee `docs/spects/05-implementation-plan.md#fase-1` para la spec completa.
Lee `docs/spects/06-component-specs.md` para specs de componentes.
Lee `docs/spects/07-state-management.md` para el store auth.

## API Layer (`src/api/auth.ts`)
- `register(data)`, `login(data)`, `logout()`, `verifyEmail(token)`, `resendVerification(email)`, `forgotPassword(data)`, `resetPassword(data)`

## Store (`src/stores/auth.ts`)
- State: token, user, loading, error
- Getters: isAuthenticated, userRoles, isAdmin, isEmailVerified
- Actions: register, login, logout, checkAuth, verifyEmail, forgotPassword, resetPassword, clearError
- Persist token en localStorage

## Composable (`src/composables/useAuth.ts`)
- Wrapper reactivo sobre auth store

## Layouts
- `AuthLayout.vue` — layout centrado minimalista
- `DefaultLayout.vue` — header + sidebar + slot contenido

## Vistas
- `RegisterView.vue`, `LoginView.vue`, `VerifyEmailView.vue`, `ForgotPasswordView.vue`, `ResetPasswordView.vue`

## Componentes
- `LoginForm.vue`, `RegisterForm.vue`, `ForgotPasswordForm.vue`, `ResetPasswordForm.vue`

## Compartidos
- `AppHeader.vue`, `AppSidebar.vue`, `LoadingSpinner.vue`, `ErrorAlert.vue`

## Router Guards
- `requiresAuth` → redirect a /login
- `requiresGuest` → redirect a /profile
- Configurar rutas en `src/router/index.ts`
