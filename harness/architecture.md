# Arquitectura — tickets-frontend

## Stack

| Componente | Herramienta | Versión |
|---|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) | ^3.4 |
| Lenguaje | TypeScript (estricto) | ^5.4 |
| Estado | Pinia | ^2.1 |
| Routing | Vue Router 4 | ^4.3 |
| HTTP | Axios | ^1.7 |
| UI Kit | shadcn-vue (basado en Radix Vue) | ^0.4 |
| Validación | Zod | ^3.23 |
| Estilos | Tailwind CSS | ^3.4 |
| Fechas | date-fns | ^3.6 |
| Iconos | lucide-vue-next | ^0.400 |
| Build | Vite | ^5.x |

## Estructura de capas

```
src/
├── api/                 # Capa de comunicación HTTP
│   ├── client.ts        # Instancia Axios + interceptores
│   ├── auth.ts          # Llamadas a /auth/*
│   ├── users.ts         # Llamadas a /users/*
│   └── profile.ts       # Llamadas a /users/me/*
│
├── stores/              # Capa de estado global (Pinia)
│   ├── auth.ts          # Token, sesión, roles
│   ├── profile.ts       # Perfil del usuario
│   └── admin.ts         # CRUD de usuarios
│
├── composables/         # Capa de lógica reactiva reutilizable
│   ├── useAuth.ts       # Wrapper de auth store
│   ├── useProfile.ts    # Wrapper de profile store
│   └── useUsers.ts      # Wrapper de admin store
│
├── types/               # Contratos de datos (espejo del backend)
│   └── api.ts           # Interfaces de requests/responses
│
├── router/              # Capa de navegación
│   ├── index.ts         # Definición de rutas
│   └── guards.ts        # Guards de autenticación y roles
│
├── views/               # Páginas (una por ruta)
│   ├── auth/
│   ├── profile/
│   └── admin/
│
├── components/          # Componentes Vue reutilizables
│   ├── ui/              # shadcn-vue components (generados)
│   ├── auth/            # Componentes de autenticación
│   ├── profile/         # Componentes de perfil
│   ├── admin/           # Componentes de administración
│   └── shared/          # Componentes compartidos
│
├── layouts/             # Layouts de página
│   ├── AuthLayout.vue
│   ├── DefaultLayout.vue
│   └── AdminLayout.vue
│
└── lib/                 # Utilidades puras
    ├── validators.ts    # Schemas Zod
    ├── formatters.ts    # Formateo de fechas, etc.
    └── constants.ts     # URLs, enums, configuración
```

## Flujo de datos

```
Vista (componente)
    ↓ (llama a)
Composable (useAuth, useProfile, etc.)
    ↓ (llama a)
Store Pinia (auth, profile, admin)
    ↓ (llama a)
API Layer (auth.ts, profile.ts, users.ts)
    ↓ (usa)
Axios Client (client.ts) → interceptores (token, errores)
    ↓
Backend (http://localhost:8000/api/v1)
```

## Principios

1. **Las vistas NO llaman a la API directamente.** Siempre a través de stores o composables.
2. **Los stores NO llaman a otros stores.** Se comunican a través de composables o componentes.
3. **Los componentes NO modifican el estado directamente.** Solo a través de actions de stores.
4. **Los schemas Zod reflejan exactamente las validaciones del backend** (ver `docs/spects/02-api-contracts.md`).
5. **Los tipos TypeScript en `src/types/api.ts` son espejo de los DTOs del backend.**

## Regla de dependencias

```
api/  →  client.ts (solo esto)
stores/  →  api/  (nunca al revés)
composables/  →  stores/  (nunca al revés)
views/  →  composables/ + components/ + layouts/
components/  →  composables/ + stores/ (solo si es necesario)
```
