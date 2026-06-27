# 07 — Gestión de Estado

## Arquitectura General

El estado global se organiza en **3 stores Pinia modulares**, cada uno responsable de un dominio:

```
Pinia Stores
├── auth        → Autenticación (token, sesión, roles)
├── profile     → Perfil del usuario autenticado
└── admin       → Administración de usuarios (solo admin)
```

Adicionalmente, los **composables** actúan como wrappers que abstraen el store y proveen una API reactiva para los componentes.

---

## Store Auth (`src/stores/auth.ts`)

### Responsabilidad
Gestionar la autenticación: login, registro, verificación de email, recuperación de contraseña, y estado de la sesión.

### State
```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

### Getters
```typescript
interface AuthGetters {
  isAuthenticated: boolean;      // token !== null y no expirado
  userRoles: UserRole[];         // user?.roles ?? []
  isAdmin: boolean;              // userRoles.includes('admin')
  isSeller: boolean;             // userRoles.includes('seller')
  isEmailVerified: boolean;      // user?.email_verified ?? false
}
```

### Actions

| Action | Descripción | API Call | Manejo de errores |
|---|---|---|---|
| `register(data)` | Registrar usuario | `POST /auth/register` | 409 → "Email already registered", 422 → validation errors |
| `login(data)` | Iniciar sesión | `POST /auth/login` | 401 → "Invalid credentials", 403 → "Email not verified" |
| `logout()` | Cerrar sesión | `POST /auth/logout` | 401 → token inválido |
| `verifyEmail(token)` | Verificar email | `GET /auth/verify-email` | 400 → token inválido/expirado |
| `resendVerification(email)` | Reenviar verificación | `POST /auth/resend-verification` | 400 → email ya verificado |
| `forgotPassword(email)` | Solicitar reset | `POST /auth/forgot-password` | Siempre 200 (genérico) |
| `resetPassword(data)` | Resetear password | `POST /auth/reset-password` | 400 → token inválido/expirado/usado |
| `checkAuth()` | Validar sesión actual | — (solo decodifica token) | Si token expirado → logout automático |
| `clearError()` | Limpiar error | — | — |

### Flujo de Persistencia

```
Login exitoso
  → guardar token en localStorage('auth_token')
  → decodificar payload JWT para obtener user info
  → setear state.token y state.user

App carga
  → checkAuth()
    → si hay token en localStorage
      → decodificar JWT
      → si expirado → logout() (limpiar todo)
      → si válido → restaurar sesión

Logout
  → llamar POST /auth/logout (best-effort)
  → eliminar token de localStorage
  → resetear state a valores iniciales
  → redirigir a login
```

### Flujo de Login

```
LoginForm.submit()
  ↓
auth.login({ email, password })
  ↓
POST /api/v1/auth/login
  ↓
200 { access_token, token_type, expires_in }
  ↓
Decodificar JWT → { sub, email, roles, exp }
  ↓
Guardar token en localStorage
Setear state.token, state.user
Redirigir a /profile
```

---

## Store Profile (`src/stores/profile.ts`)

### Responsabilidad
Gestionar la información del perfil del usuario autenticado.

### State
```typescript
interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}
```

### Actions

| Action | Descripción | API Call | Errores |
|---|---|---|---|
| `fetchProfile()` | Obtener perfil | `GET /users/me` | 401 → no autenticado |
| `updateProfile(data)` | Actualizar perfil | `PATCH /users/me` | 422 → teléfono inválido |
| `uploadAvatar(file)` | Subir avatar | `POST /users/me/photo` (multipart) | 422 → archivo inválido |
| `addRole(role)` | Añadir rol | `POST /users/me/roles` | 409 → rol ya asignado |

### Consideraciones
- `fetchProfile()` se llama automáticamente después de login exitoso
- `uploadAvatar` actualiza el `avatar_url` del store y también del store auth
- `addRole` actualiza la lista de roles en ambos stores (profile + auth)

---

## Store Admin (`src/stores/admin.ts`)

### Responsabilidad
Gestionar el CRUD de usuarios (solo para administradores).

### State
```typescript
interface AdminState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
```

### Actions

| Action | Descripción | API Call | Errores |
|---|---|---|---|
| `fetchUsers()` | Listar usuarios | `GET /users` | — |
| `fetchUser(id)` | Obtener usuario | `GET /users/{id}` | 404 → not found |
| `createUser(data)` | Crear usuario | `POST /users` | 409 → email duplicado |
| `updateUser(id, data)` | Actualizar usuario | `PUT /users/{id}` | 404 → not found |
| `deleteUser(id)` | Soft delete | `DELETE /users/{id}` | 404 → not found |

---

## Comunicación entre Stores

```
Auth Store (token, user, roles)
    │
    ├── Profile Store (profile detail)
    │       └── Actualiza avatar_url y roles en Auth Store cuando cambian
    │
    └── Admin Store (user list)
            └── No depende de Auth Store directamente
                (usa solo la verificación de token vía interceptor Axios)
```

### Reglas
- Los stores NO deben depender directamente unos de otros (sin `useXStore()` dentro de otro store).
- Los stores se comunican a través de los composables o de los componentes que los consumen.
- Excepción: Profile Store puede actualizar campos específicos del Auth Store (avatar_url, roles) mediante callbacks o events.

---

## Composición de Stores en Componentes

### Patrón para componentes

```typescript
// Dentro de un componente .vue
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'

const {
  user,           // reactivo
  isAuthenticated,
  login,
  logout,
  loading: authLoading,
  error: authError,
} = useAuth()

const {
  profile,
  fetchProfile,
  updateProfile,
  loading: profileLoading,
} = useProfile()

// Uso
onMounted(async () => {
  if (isAuthenticated.value && !profile.value) {
    await fetchProfile()
  }
})
```

### Reglas de actualización de estado

1. **Unidirectional data flow:** los stores son la única fuente de verdad.
2. **Los componentes NO modifican el estado directamente** — siempre a través de actions.
3. **Errores de API** se capturan en el store, se setean en `state.error`, y los componentes los muestran.
4. **Loading states** por acción (no global) para permitir UI granular.

---

## Axios Interceptors

### Request Interceptor
```typescript
// src/api/client.ts
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor
```typescript
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      // Email no verificado
      // El componente maneja este error específico
    }
    return Promise.reject(error)
  }
)
```

---

## Mapa de Stores a Vistas

| Vista | Stores que consume | Composables |
|---|---|---|
| `LoginView` | auth | `useAuth` |
| `RegisterView` | auth | `useAuth` |
| `VerifyEmailView` | auth | `useAuth` |
| `ForgotPasswordView` | auth | `useAuth` |
| `ResetPasswordView` | auth | `useAuth` |
| `ProfileView` | auth, profile | `useAuth`, `useProfile` |
| `UsersListView` | admin | `useUsers` |
| `UserDetailView` | admin | `useUsers` |
