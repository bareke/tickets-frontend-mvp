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

## 2026-06-29 11:15 — F2-profile

**Fase:** F2-profile
**Estado:** done

### Log
- Creada API layer (`src/api/profile.ts`): getProfile, updateProfile, uploadAvatar, addRole
- Creado profile store (`src/stores/profile.ts`): profile state, fetchProfile, updateProfile, uploadAvatar, addRole, uploadProgress
- Creado composable (`src/composables/useProfile.ts`): wrapper reactivo sobre profile store
- Creado ProfileCard.vue: avatar con iniciales fallback, nombre, email, roles badges por color, fecha membrecía
- Creado ProfileEditForm.vue: formulario inline name/lastname/phone con validación Zod, guardar/cancelar
- Creado AvatarUpload.vue: input file con preview, validación JPG/PNG max 2MB, upload con progreso
- Creado RoleSelector.vue: badges de roles, botón "Convertirse en vendedor" con diálogo de confirmación
- Actualizado ProfileView.vue: layout completo con cards de perfil, edición, avatar y roles
- Build exitoso (npm run build), TypeScript check pasó

### Decisiones
- Profile store mantiene `uploadProgress` para barra de progreso de avatar (no implementada en UI actual, estado disponible)
- ProfileCard usa iniciales como fallback cuando no hay avatar_url
- ProfileEditForm usa `editingKey` para reiniciar estado tras guardado exitoso
- RoleSelector usa shadcn-vue Dialog para confirmación antes de añadir rol vendedor

## 2026-06-29 11:45 — F3-admin

**Fase:** F3-admin
**Estado:** done

### Log
- Creada API layer (`src/api/users.ts`): getUsers, getUser, createUser, updateUser, deleteUser
- Creado admin store (`src/stores/admin.ts`): users list, CRUD actions, loading/error states
- Creado composable (`src/composables/useUsers.ts`): wrapper reactivo sobre admin store
- Creado UserTable.vue: tabla responsiva con loading (skeleton), empty, error, sort, acciones editar/eliminar
- Creado UserCreateDialog.vue: modal con formulario email/password/name/lastname/role, validación Zod
- Creado UserEditDialog.vue: modal pre-poblado con datos del usuario, password opcional
- Actualizado UsersListView.vue: layout completo con tabla + diálogos + confirmación de eliminación
- Añadido guard `requiresAdmin` en guards.ts (decodifica JWT vía atob)
- Actualizado router: ruta /admin/users usa `requiresAuth + requiresAdmin`
- Build exitoso (npm run build), TypeScript check pasó

### Decisiones
- requiresAdmin decodifica JWT con atob (no necesita jwt-decode) para evitar imports circulares
- AdminLayout no implementado — se usa DefaultLayout directamente (sidebar + header)
- UserEditDialog usa watch en prop user para pre-poblar el formulario
- Eliminación usa diálogo de confirmación separado (no dentro de UserTable)

