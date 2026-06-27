# 04 — Arquitectura del Frontend

## Stack Técnico Especificado

| Componente | Tecnología | Propósito |
|---|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) | UI reactiva |
| Lenguaje | TypeScript (estricto) | Tipado seguro |
| Estado global | Pinia | Stores modulares por dominio |
| Routing | Vue Router 4 | Navegación + guards |
| HTTP Client | Axios | Comunicación con la API |
| UI Kit | shadcn-vue | Componentes accesibles y personalizables |
| Validación | Zod | Schemas de formularios (paridad con Pydantic) |
| Estilos | Tailwind CSS | Utilidades CSS |
| Fechas | date-fns | Formateo y manipulación de fechas |
| Iconos | lucide-vue-next | Iconos SVG |

## Estructura de Carpetas Propuesta

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts              # Instancia Axios + interceptores
│   │   ├── auth.ts                # Llamadas a /auth/*
│   │   ├── users.ts               # Llamadas a /users/*
│   │   └── profile.ts             # Llamadas a /users/me/*
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes base de shadcn-vue
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   ├── RegisterForm.vue
│   │   │   ├── ForgotPasswordForm.vue
│   │   │   └── ResetPasswordForm.vue
│   │   ├── profile/
│   │   │   ├── ProfileCard.vue
│   │   │   ├── ProfileEditForm.vue
│   │   │   ├── AvatarUpload.vue
│   │   │   └── RoleSelector.vue
│   │   ├── admin/
│   │   │   ├── UserTable.vue
│   │   │   ├── UserCreateDialog.vue
│   │   │   └── UserEditDialog.vue
│   │   └── shared/
│   │       ├── AppHeader.vue
│   │       ├── AppSidebar.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ErrorAlert.vue
│   │
│   ├── composables/
│   │   ├── useAuth.ts             # Lógica de autenticación reactiva
│   │   ├── useProfile.ts          # Lógica de perfil
│   │   └── useUsers.ts            # Lógica de admin
│   │
│   ├── layouts/
│   │   ├── AuthLayout.vue         # Layout para login/register
│   │   ├── DefaultLayout.vue      # Layout con header + sidebar
│   │   └── AdminLayout.vue        # Layout para administración
│   │
│   ├── lib/
│   │   ├── formatters.ts          # Formateo de fechas, nombres
│   │   ├── validators.ts          # Schemas Zod (paridad backend)
│   │   └── constants.ts           # URLs, enums, config
│   │
│   ├── router/
│   │   ├── index.ts               # Configuración de rutas
│   │   └── guards.ts              # Guards de autenticación y roles
│   │
│   ├── stores/
│   │   ├── auth.ts                # Store de autenticación
│   │   ├── profile.ts             # Store de perfil de usuario
│   │   └── admin.ts               # Store de administración
│   │
│   ├── types/
│   │   └── api.ts                 # Interfaces TypeScript (espejo del backend)
│   │
│   ├── views/
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── VerifyEmailView.vue
│   │   │   ├── ForgotPasswordView.vue
│   │   │   └── ResetPasswordView.vue
│   │   ├── profile/
│   │   │   └── ProfileView.vue
│   │   └── admin/
│   │       ├── UsersListView.vue
│   │       └── UserDetailView.vue
│   │
│   ├── App.vue
│   └── main.ts
│
├── docs/spects/                    # Documentación del plan
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json                 # Configuración de shadcn-vue
└── package.json
```

## Decisiones Técnicas

### 1. Axios con interceptores
- **Interceptor de request**: inyecta el token JWT del store en el header `Authorization`.
- **Interceptor de response**: captura errores 401 y redirige al login automáticamente. Captura 403 y muestra mensaje de "email no verificado".

### 2. Zod para validación de formularios
- Los schemas Zod deben reflejar exactamente las validaciones del backend:
  - Password: `z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/)`
  - Phone: `z.string().regex(/^\d{7,15}$/).optional()`
  - Email: `z.string().email()`

### 3. Pinia stores modulares
- **auth store**: token, user data, login/register/logout actions, `checkAuth` (verificar expiración).
- **profile store**: perfil del usuario, updateProfile, uploadAvatar, addRole.
- **admin store**: lista de usuarios, CRUD.

### 4. Vue Router guards
- `requiresAuth`: redirect a login si no hay token.
- `requiresVerification`: redirect a "verifica tu email" si `email_verified === false`.
- `requiresRole: admin`: redirect si el usuario no es admin.

### 5. Manejo de tokens
- El token JWT se almacena en `localStorage` (persistencia entre sesiones).
- El store verifica la expiración del token al cargar la app.
- Al hacer logout, se elimina el token del store y localStorage.

### 6. Proxy de Vite para desarrollo
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```
Esto evita problemas de CORS durante el desarrollo.

## Dependencias npm

```json
{
  "vue": "^3.4",
  "vue-router": "^4.3",
  "pinia": "^2.1",
  "axios": "^1.7",
  "zod": "^3.23",
  "date-fns": "^3.6",
  "lucide-vue-next": "^0.400",
  "tailwindcss": "^3.4",
  "shadcn-vue": "^0.4",
  "radix-vue": "^1.9"
}
```
