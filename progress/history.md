# Historial de sesiones

## 2026-06-27 15:56 — F0-scaffolding

**Fase:** F0-scaffolding
**Estado:** done

### Log
- Inicializado proyecto con Vite + Vue 3 + TypeScript
- Instaladas dependencias base: vue-router, pinia, axios, zod, date-fns, @lucide/vue
- Instalado tailwindcss (v4), postcss, autoprefixer
- Configurado Tailwind CSS v4 (style.css con @import)
- Inicializado shadcn-vue v2.7 (preset vega, base reka, iconos lucide)
- Añadidos componentes UI: button, input, card, form, label, alert, dialog, table, badge, select, skeleton
- Creada estructura de carpetas completa
- Creado src/types/api.ts con interfaces del backend
- Creado src/api/client.ts con Axios + interceptores (token, 401 redirect)
- Creado src/lib/validators.ts con schemas Zod
- Creado src/router/index.ts con rutas + guards (requiresAuth, requiresGuest)
- Creados placeholder views para todas las rutas
- Configurado vite.config.ts (alias @/ + proxy /api → localhost:8000)
- Actualizado App.vue, main.ts con Pinia + Router
- Build exitoso (npm run build), TypeScript check pasó

### Decisiones
- shadcn-vue v2.7 requiere TailwindCSS v4 (no v3 como especificaba el plan original)
- @lucide/vue reemplaza a lucide-vue-next (deprecado)
- Toast no disponible en shadcn-vue v2.7, se usará Sonner en Fase 4

## 2026-06-29 10:30 — F1-auth

**Fase:** F1-auth
**Estado:** done

### Log
- Creada capa API (`src/api/auth.ts`): register, login, logout, verifyEmail, resendVerification, forgotPassword, resetPassword
- Creado auth store (`src/stores/auth.ts`): Pinia store con JWT handling (jwt-decode), localStorage persistence, y métodos login/register/logout/setUser/clearAuth
- Creado composable (`src/composables/useAuth.ts`): wrapper reactivo sobre auth store
- Creados layouts: AuthLayout (vista centrada para auth), DefaultLayout (sidebar + header para app)
- Creados componentes compartidos: AppHeader, AppSidebar, LoadingSpinner, ErrorAlert
- Creados formularios: LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
- Creadas vistas: LoginView, RegisterView, VerifyEmailView, ForgotPasswordView, ResetPasswordView
- Actualizados router guards (requiresAuth, requiresGuest) con localStorage directo
- Actualizado router/index.ts con todas las rutas de auth (lazy-loaded)
- Construido shadcn-vue componentes faltantes: Input, Alert, Form
- Build exitoso (npm run build), TypeScript check pasó

### Decisiones
- Auth store persiste token en localStorage y valida expiración via jwtDecode
- Router guards leen localStorage directamente (store puede no estar inicializada durante navegación)
- Componentes UI usan shadcn-vue v2.7 (compatible con Tailwind v4)
- Las vistas de auth son standalone (no usan DefaultLayout) para evitar mostrar sidebar antes de login

