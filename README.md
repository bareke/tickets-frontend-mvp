# Tickets Frontend MVP

Frontend para sistema de gestión de tickets (MVP). Construido con Vue 3 + TypeScript + shadcn-vue + Tailwind CSS v4.

## Requisitos

- Node.js 22+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

Inicia el servidor de desarrollo (por defecto en `http://localhost:5173`):

```bash
npm run dev
```

El frontend espera un backend FastAPI corriendo en `http://localhost:8000`.  
Las peticiones a `/api/*` se redirigen automáticamente al backend vía proxy de Vite.

## Build

```bash
npm run build
```

Genera los archivos estáticos en `dist/`.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 + Composition API |
| Lenguaje | TypeScript |
| UI | shadcn-vue (Reka UI) |
| Estilos | Tailwind CSS v4 + tw-animate-css |
| Estado | Pinia |
| Router | Vue Router 4 |
| Formularios | vee-validate + Zod |
| Peticiones HTTP | Axios |
| Íconos | Lucide |
| Fechas | date-fns |
| Build | Vite + vue-tsc |

## Estructura

```
src/
├── api/          # Cliente HTTP y endpoints
├── components/   # UI (shadcn) + componentes de negocio
├── composables/  # Lógica reactiva reutilizable
├── layouts/      # Layouts (AuthLayout, DefaultLayout)
├── lib/          # Utilidades (cn, validators, roles, api-error)
├── router/       # Rutas y guards
├── stores/       # Stores Pinia (auth, profile, admin)
├── types/        # Tipos e interfaces compartidos
└── views/        # Páginas/vistas
```

## Fases del MVP

- F0 — Scaffolding (Vite, Tailwind, shadcn-vue, router, Pinia)
- F1 — Autenticación (login, register, email, password)
- F2 — Perfil de usuario
- F3 — Administración de usuarios (CRUD)
- F4 — Polacos (toasts, responsive, sidebar, refactors)

Ver `feature_list.json` y `progress/` para detalle.
