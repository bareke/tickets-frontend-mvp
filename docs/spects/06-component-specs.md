# 06 — Especificación de Componentes

## Convenciones

- Todos los componentes usan `<script setup lang="ts">`
- Props tipadas con `defineProps<T>()`
- Emits tipados con `defineEmits<T>()`
- Componentes de shadcn-vue en `src/components/ui/` (generados por CLI)
- Componentes de negocio en carpetas por módulo (`auth/`, `profile/`, `admin/`)
- Componentes compartidos en `shared/`

---

## Componentes Compartidos

### `AppHeader.vue`
- **Props:** ninguna
- **Slots:** ninguna
- **Comportamiento:**
  - Logo/nombre de la app a la izquierda
  - Menú de navegación (si autenticado: Profile, Logout; si no: Login, Register)
  - Avatar + nombre del usuario si autenticado
- **Dependencias:** `useAuth()`, `lucide-vue-next` (Menu, User, LogOut)

### `AppSidebar.vue`
- **Props:** ninguna
- **Comportamiento:**
  - Navegación lateral con links
  - Links condicionales según roles (admin ve sección Admin)
  - Colapsable en mobile
- **Dependencias:** `useAuth()`

### `LoadingSpinner.vue`
- **Props:** `size?: 'sm' | 'md' | 'lg'`
- **Comportamiento:** Spinner SVG animado centrado

### `ErrorAlert.vue`
- **Props:** `title: string`, `message: string`, `variant?: 'destructive' | 'warning'`
- **Comportamiento:** Alerta de error con título y mensaje
- **Dependencias:** shadcn-vue `Alert`

---

## Componentes de Auth

### `LoginForm.vue`
- **Emits:** `success(token: TokenResponse)`
- **Slots:** `footer` (link a register, forgot-password)
- **Comportamiento:**
  - Campos: email (type email), password (type password)
  - Validación Zod en cliente (email válido, password no vacío)
  - Botón "Iniciar sesión" con estado loading
  - Manejo de errores: 401 → "Credenciales inválidas", 403 → "Email no verificado",
    422 → errores de validación
- **Estados:** idle, submitting, error, success
- **Dependencias:** `zod`, `useAuth()`, shadcn-vue `Button`, `Input`, `Label`, `Form`

### `RegisterForm.vue`
- **Emits:** `success(user: User)`
- **Comportamiento:**
  - Campos: email, password, confirmPassword, name, lastname, phone (opcional)
  - Validación Zod: password (8+ chars, mayúscula, minúscula, dígito), phone (7-15 dígitos), confirmPassword (match)
  - Botón "Crear cuenta" con estado loading
  - Manejo de 409 → "Este email ya está registrado"
- **Estados:** idle, submitting, error, success
- **Dependencias:** `zod`, `useAuth()`, shadcn-vue `Button`, `Input`, `Card`

### `ForgotPasswordForm.vue`
- **Emits:** `success()`
- **Comportamiento:**
  - Campo: email
  - Botón "Enviar enlace"
  - Mensaje genérico tras envío: "Si el email existe, recibirás un enlace"
- **Dependencias:** `useAuth()`, shadcn-vue `Button`, `Input`

### `ResetPasswordForm.vue`
- **Props:** `token: string`
- **Emits:** `success()`
- **Comportamiento:**
  - Campos: newPassword, confirmPassword
  - Validación Zod (mismas reglas que registro)
  - Botón "Restablecer contraseña"
- **Dependencias:** `zod`, `useAuth()`, shadcn-vue `Button`, `Input`

---

## Componentes de Profile

### `ProfileCard.vue`
- **Props:** `user: User`
- **Comportamiento:**
  - Avatar (con fallback iniciales si no hay avatar_url)
  - Nombre completo
  - Email
  - Roles como badges de colores (buyer=blue, seller=green, admin=red)
  - Miembro desde (fecha formateada con date-fns)
- **Dependencias:** `date-fns`, `lucide-vue-next` (User, Mail, Calendar)

### `ProfileEditForm.vue`
- **Props:** `user: User`
- **Emits:** `saved(user: User)`, `cancelled()`
- **Comportamiento:**
  - Campos: name, lastname, phone (pre-poblados)
  - Validación Zod para phone
  - Botones "Guardar" y "Cancelar"
  - En modo edición reemplaza la vista estática
- **Dependencias:** `zod`, `useProfile()`, shadcn-vue `Button`, `Input`

### `AvatarUpload.vue`
- **Props:** `currentAvatarUrl?: string`, `userId: number`
- **Emits:** `uploaded(avatarUrl: string)`
- **Comportamiento:**
  - Preview del avatar actual
  - Dropzone o input file
  - Validación: solo JPG/PNG, max 2MB (cliente + servidor)
  - Preview de la imagen seleccionada antes de subir
  - Barra de progreso durante upload
  - Al hacer clic en la imagen actual, abre selector de archivos
- **Estados:** idle, hasFile, uploading, error, success
- **Dependencias:** `useProfile()`, `lucide-vue-next` (Camera, Upload)

### `RoleSelector.vue`
- **Props:** `currentRoles: string[]`
- **Emits:** `roleAdded(roles: string[])`
- **Comportamiento:**
  - Mostrar roles actuales como badges
  - Si no tiene `seller`, mostrar botón "Convertirse en vendedor"
  - Diálogo de confirmación antes de agregar
  - Si ya tiene `seller`, mostrar mensaje "Ya eres vendedor"
  - Roles admin no se muestran aquí (solo admins pueden asignar admin)
- **Dependencias:** `useProfile()`, shadcn-vue `Button`, `Dialog`, `Badge`

---

## Componentes de Admin

### `UserTable.vue`
- **Props:** `users: User[]`, `loading: boolean`
- **Emits:** `edit(user: User)`, `delete(user: User)`
- **Comportamiento:**
  - Tabla responsiva con shadcn-vue Table
  - Columnas: ID, Nombre, Email, Roles, Creado, Acciones
  - Roles como badges
  - Fecha formateada con date-fns
  - Estados: loading (skeleton), empty ("No hay usuarios"), error
  - Acciones por fila: editar (icono lápiz), eliminar (icono papelera)
- **Dependencias:** `date-fns`, shadcn-vue `Table`, `Badge`, `Button`, `Skeleton`

### `UserCreateDialog.vue`
- **Emits:** `created(user: User)`, `closed()`
- **Comportamiento:**
  - Diálogo modal
  - Campos: email, password, name, lastname, role (select: buyer/seller/admin)
  - Validación Zod (password, email)
  - Botones "Crear" y "Cancelar"
- **Dependencias:** `zod`, `useUsers()`, shadcn-vue `Dialog`, `Button`, `Input`, `Select`

### `UserEditDialog.vue`
- **Props:** `user: User`
- **Emits:** `updated(user: User)`, `closed()`
- **Comportamiento:**
  - Diálogo modal pre-poblado con datos del usuario
  - Campos: email, password (opcional, dejar vacío = no cambiar), name, lastname, role
  - Validación Zod (solo si password se proporciona)
  - Botones "Guardar" y "Cancelar"
- **Dependencias:** `zod`, `useUsers()`, shadcn-vue `Dialog`, `Button`, `Input`, `Select`

---

## Mapa de Componentes a Vistas

| Vista | Componentes que usa |
|---|---|
| `LoginView` | `AuthLayout`, `LoginForm` |
| `RegisterView` | `AuthLayout`, `RegisterForm` |
| `VerifyEmailView` | `AuthLayout`, `Button` (resend), `Alert` |
| `ForgotPasswordView` | `AuthLayout`, `ForgotPasswordForm` |
| `ResetPasswordView` | `AuthLayout`, `ResetPasswordForm` |
| `ProfileView` | `DefaultLayout`, `ProfileCard`, `ProfileEditForm`, `AvatarUpload`, `RoleSelector` |
| `UsersListView` | `AdminLayout`, `UserTable`, `UserCreateDialog`, `UserEditDialog` |
| `UserDetailView` | `AdminLayout`, `ProfileCard`, `UserEditDialog` |

## Estados de cada Componente

Cada componente debe manejar al menos 4 estados:

| Estado | Descripción | UI |
|---|---|---|
| `idle` | Estado inicial, sin interacción | Formulario vacío o datos cargados |
| `loading` | Operación en curso | Spinner o skeleton |
| `error` | Error de validación o servidor | Mensaje de error en el formulario o Alert |
| `success` | Operación completada | Feedback visual + emit/redirect |
