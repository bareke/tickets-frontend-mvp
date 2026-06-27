# 05 — Plan de Implementación

Este plan describe las fases para construir el frontend del sistema de tickets, conectándose al backend existente. Cada fase es ejecutable de forma independiente.

---

## Fase 0 — Scaffolding y Configuración Inicial

**Objetivo:** Inicializar el proyecto con todas las herramientas y configuración necesarias.

### Tareas

- [ ] **0.1** Inicializar proyecto Vue 3 + Vite + TypeScript
  - `npm create vite@latest tickets-frontend -- --template vue-ts`
- [ ] **0.2** Instalar dependencias base
  - `vue-router`, `pinia`, `axios`, `zod`, `date-fns`, `lucide-vue-next`
- [ ] **0.3** Configurar Tailwind CSS
  - Instalar `tailwindcss`, `postcss`, `autoprefixer`
  - Crear `tailwind.config.ts` y `postcss.config.js`
  - Importar directivas en `main.css`
- [ ] **0.4** Configurar shadcn-vue
  - Seguir guía de instalación oficial: `npx shadcn-vue@latest init`
  - Configurar `components.json` con base de Tailwind + `@/components` alias
- [ ] **0.5** Configurar Axios (`src/api/client.ts`)
  - Instancia base con `baseURL: '/api/v1'`
  - Interceptor de request: inyectar token JWT desde localStorage
  - Interceptor de response: manejar 401 (redirect a login), 403 (email no verificado), errores genéricos
- [ ] **0.6** Crear estructura de carpetas (vacías)
  - `src/api/`, `src/components/`, `src/composables/`, `src/layouts/`, `src/lib/`, `src/router/`, `src/stores/`, `src/types/`, `src/views/`
- [ ] **0.7** Configurar Vue Router (`src/router/index.ts`)
  - Definir rutas base (públicas, protegidas, admin)
  - Crear archivo `guards.ts` con `beforeEach`
- [ ] **0.8** Crear tipos TypeScript (`src/types/api.ts`)
  - Interfaces: `User`, `UserRole`, `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UpdateProfileRequest`, `AddRoleRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `ApiError`, `ValidationErrorDetail`
- [ ] **0.9** Crear schemas Zod (`src/lib/validators.ts`)
  - `registerSchema`, `loginSchema`, `updateProfileSchema`, `resetPasswordSchema`, `addRoleSchema`
- [ ] **0.10** Configurar proxy de Vite para desarrollo (`vite.config.ts`)
  - `/api` → `http://localhost:8000`

**Criterio de éxito:** `npm run dev` levanta el proyecto sin errores. Navegar a `http://localhost:5173` muestra la app en blanco sin errores de consola.

---

## Fase 1 — Autenticación (Auth Module)

**Objetivo:** Permitir registro, login, verificación de email, recuperación de contraseña y logout.

### API Layer

- [ ] **1.1** Crear `src/api/auth.ts`
  - `register(data: RegisterRequest): Promise<User>`
  - `login(data: LoginRequest): Promise<TokenResponse>`
  - `logout(): Promise<void>`
  - `verifyEmail(token: string): Promise<{ message: string }>`
  - `resendVerification(email: string): Promise<{ message: string }>`
  - `forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }>`
  - `resetPassword(data: ResetPasswordRequest): Promise<{ message: string }>`

### Store Auth

- [ ] **1.2** Crear `src/stores/auth.ts`
  - **State:** `token: string | null`, `user: User | null`, `isAuthenticated: boolean`
  - **Actions:** `register`, `login`, `logout`, `checkAuth` (validar expiración del token), `verifyEmail`, `resendVerification`, `forgotPassword`, `resetPassword`
  - **Getters:** `isLoggedIn`, `userRoles`, `isAdmin`
  - Persistencia: `localStorage` para el token

### Composables

- [ ] **1.3** Crear `src/composables/useAuth.ts`
  - Wrapper sobre el store auth para uso en componentes
  - Expone: `user`, `isAuthenticated`, `isAdmin`, `login()`, `register()`, `logout()`, etc.

### Layouts

- [ ] **1.4** Crear `src/layouts/AuthLayout.vue`
  - Layout minimalista centrado (para login, register, etc.)
  - Sin sidebar ni header

- [ ] **1.5** Crear `src/layouts/DefaultLayout.vue`
  - Header con navegación + sidebar opcional
  - Slot para contenido principal

### Vistas Auth

- [ ] **1.6** Crear `src/views/auth/RegisterView.vue`
  - Formulario de registro con campos: email, password, confirm password, name, lastname, phone (opcional)
  - Validación con Zod (paridad backend: password 8+ chars, mayúscula, minúscula, dígito)
  - Mostrar errores del backend (409 email duplicado, 422 validación)
  - Redirigir a "verifica tu email" tras registro exitoso

- [ ] **1.7** Crear `src/views/auth/LoginView.vue`
  - Formulario: email, password
  - Manejar 401 (credenciales inválidas) y 403 (email no verificado)
  - Guardar token en store + localStorage
  - Redirigir a dashboard/profile tras login exitoso

- [ ] **1.8** Crear `src/views/auth/VerifyEmailView.vue`
  - Página de "Revisa tu email" tras registro
  - Botón "Reenviar email de verificación"
  - Capturar token de URL en `verify-email?token=...` y llamar a verifyEmail

- [ ] **1.9** Crear `src/views/auth/ForgotPasswordView.vue`
  - Formulario: email
  - Mostrar mensaje genérico ("Si el email existe, recibirás un enlace")

- [ ] **1.10** Crear `src/views/auth/ResetPasswordView.vue`
  - Formulario: new_password, confirm_password
  - Capturar token de query params
  - Validar password con Zod
  - Redirigir a login tras éxito

### Router Guards

- [ ] **1.11** Implementar guards en `src/router/guards.ts`
  - `requiresAuth`: redirigir a login si no hay token
  - `requiresGuest`: redirigir a profile si ya está autenticado
  - `requiresVerification`: redirigir a verify-email si `email_verified === false`

### Componentes Compartidos

- [ ] **1.12** Crear componentes de shadcn-vue necesarios
  - Button, Input, Card, Form, Label, Alert, Toast
  - Usar `npx shadcn-vue@latest add button input card form label alert toast`

**Criterio de éxito:** Flujo completo de registro → verificación → login → logout funciona contra el backend real.

---

## Fase 2 — Perfil de Usuario (Profile Module)

**Objetivo:** Ver y editar perfil, subir avatar, gestionar roles.

### API Layer

- [ ] **2.1** Crear `src/api/profile.ts`
  - `getProfile(): Promise<User>`
  - `updateProfile(data: UpdateProfileRequest): Promise<User>`
  - `uploadAvatar(file: File): Promise<{ avatar_url: string }>`
  - `addRole(role: UserRole): Promise<{ roles: UserRole[] }>`

### Store Profile

- [ ] **2.2** Crear `src/stores/profile.ts`
  - **State:** `profile: User | null`
  - **Actions:** `fetchProfile`, `updateProfile`, `uploadAvatar`, `addRole`

### Composables

- [ ] **2.3** Crear `src/composables/useProfile.ts`
  - Wrapper sobre profile store

### Vistas Profile

- [ ] **2.4** Crear `src/views/profile/ProfileView.vue`
  - Mostrar información del usuario (nombre, email, roles, teléfono, avatar)
  - Botón "Editar perfil" que activa modo edición inline
  - Sección de avatar con preview y botón de cambiar foto
  - Sección de roles: mostrar roles actuales + botón "Convertirse en vendedor" si no lo es

### Componentes Profile

- [ ] **2.5** Crear `src/components/profile/ProfileCard.vue`
  - Card con datos del perfil
  - Avatar, nombre, email, roles como badges

- [ ] **2.6** Crear `src/components/profile/ProfileEditForm.vue`
  - Formulario inline: name, lastname, phone
  - Validación Zod (phone 7-15 dígitos)
  - Botón guardar/cancelar

- [ ] **2.7** Crear `src/components/profile/AvatarUpload.vue`
  - Dropzone o input file para imagen
  - Preview de la imagen seleccionada
  - Validación: solo JPG/PNG, max 2MB
  - Mostrar progreso de upload

- [ ] **2.8** Crear `src/components/profile/RoleSelector.vue`
  - Botón "Convertirse en vendedor"
  - Confirmación antes de agregar rol

**Criterio de éxito:** Usuario autenticado puede ver su perfil, editar nombre/teléfono, subir avatar, y añadir rol de vendedor.

---

## Fase 3 — Administración (Admin Module)

**Objetivo:** CRUD de usuarios para administradores.

### API Layer

- [ ] **3.1** Crear `src/api/users.ts`
  - `getUsers(): Promise<User[]>`
  - `getUser(id: number): Promise<User>`
  - `createUser(data: RegisterRequest & { role: UserRole }): Promise<User>`
  - `updateUser(id: number, data: Partial<User>): Promise<User>`
  - `deleteUser(id: number): Promise<User>`

### Store Admin

- [ ] **3.2** Crear `src/stores/admin.ts`
  - **State:** `users: User[]`, `selectedUser: User | null`, `loading: boolean`
  - **Actions:** `fetchUsers`, `fetchUser`, `createUser`, `updateUser`, `deleteUser`

### Vistas Admin

- [ ] **3.3** Crear `src/views/admin/UsersListView.vue`
  - Tabla con listado de usuarios
  - Columnas: id, nombre, email, roles, creado, acciones
  - Botón "Crear usuario" → abre diálogo
  - Botones Editar/Eliminar por fila
  - Confirmación antes de eliminar

- [ ] **3.4** Crear `src/views/admin/UserDetailView.vue` (opcional)
  - Vista detalle de un usuario individual

### Componentes Admin

- [ ] **3.5** Crear `src/components/admin/UserTable.vue`
  - Tabla responsiva con shadcn-vue Table
  - Columnas sortables
  - Estados vacío, loading, error

- [ ] **3.6** Crear `src/components/admin/UserCreateDialog.vue`
  - Diálogo modal con formulario de creación
  - Campos: email, password, name, lastname, role (select)
  - Validación Zod

- [ ] **3.7** Crear `src/components/admin/UserEditDialog.vue`
  - Diálogo modal para editar usuario
  - Campos: email, password (opcional), name, lastname, role

### Router

- [ ] **3.8** Añadir guard `requiresAdmin` a rutas admin
  - Verificar que `userRoles.includes('admin')`

**Criterio de éxito:** Usuario admin puede listar, crear, editar y eliminar usuarios.

---

## Fase 4 — Polish y Finalización

**Objetivo:** Mejorar la experiencia de usuario y robustez.

### Tareas

- [ ] **4.1** Manejo global de errores
  - Componente `ErrorAlert.vue` para mostrar errores de API
  - Toast/snackbar para operaciones exitosas

- [ ] **4.2** Loading states
  - `LoadingSpinner.vue` para estados de carga
  - Skeletons para tablas y cards

- [ ] **4.3** Responsive design
  - Asegurar que todas las vistas funcionan en mobile
  - Sidebar colapsable en móvil

- [ ] **4.4** Refresh token (si aplica)
  - Si el backend implementa refresh tokens en el futuro

- [ ] **4.5** Pruebas
  - Pruebas de integración de los flujos principales
  - Pruebas de componentes con Vitest + Vue Testing Library

**Criterio de éxito:** La app es usable, responsive y maneja todos los estados (loading, empty, error, success).

---

## Resumen de Dependencias entre Fases

```
Fase 0 (Scaffolding)
    └── Fase 1 (Auth)
            ├── Fase 2 (Profile) — requiere estar autenticado
            └── Fase 3 (Admin) — requiere rol admin
                    └── Fase 4 (Polish) — mejora todas las fases anteriores
```

Cada fase produce artefactos verificables que pueden ser probados contra el backend real sin esperar a fases posteriores.
