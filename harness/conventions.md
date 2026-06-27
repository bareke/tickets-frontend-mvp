# Conventions — tickets-frontend

## Estilo de código

### TypeScript
- `strict: true` en `tsconfig.json`
- Tipado explícito en props, emits, returns de funciones
- Evitar `any`. Usar `unknown` si es necesario y hacer type narrowing
- Preferir `interface` sobre `type` para objetos
- Usar `type` para uniones, tuplas y primitivos

### Vue
- `<script setup lang="ts">` siempre
- Nombres de componentes: PascalCase (multi-palabra)
- Props con `defineProps<T>()` tipado
- Emits con `defineEmits<T>()` tipado
- ref() y computed() para reactividad local
- watch() para efectos secundarios

### Archivos
- kebab-case para archivos de componentes dentro de carpetas
- camelCase para archivos de lógica (stores, composables, api)
- Un componente por archivo
- Las vistas en `views/` terminan en `View.vue`

### Nomenclatura
- **Stores:** `useXStore` (ej: `useAuthStore`)
- **Composables:** `useX` (ej: `useAuth`, `useProfile`)
- **API functions:** `verboRecurso` (ej: `getUsers`, `createUser`)
- **Eventos:** prefijo `on` (ej: `onSubmit`, `onCancel`)

## shadcn-vue

- No modificar los componentes en `components/ui/` generados por la CLI
- Para personalizar, crear wrappers en los componentes de negocio
- Usar `npx shadcn-vue@latest add <componente>` para añadir nuevos

## Tailwind

- Preferir utilidades Tailwind sobre CSS personalizado
- Usar variables CSS de Tailwind para colores (`bg-primary`, `text-muted-foreground`)
- No crear archivos CSS globales extensos

## Zod

- Los schemas deben coincidir exactamente con las validaciones Pydantic del backend
- Validación de password: `z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/)`
- Validación de phone: `z.string().regex(/^\d{7,15}$/).optional()`
- Los errores de Zod se muestran en el formulario, los errores HTTP se muestran en Alert/Toast

## Manejo de errores

- Errores 401 → interceptor de Axios redirige a login
- Errores 403 → mostrar mensaje "Email no verificado"
- Errores 409 → mostrar "El email ya está registrado" / "El rol ya está asignado"
- Errores 422 → mostrar errores de validación en cada campo
- Errores 404 → mostrar "Usuario no encontrado"
- Errores de red → mostrar "Error de conexión con el servidor"

## Testing (cuando se implemente)

- Framework: Vitest + @vue/test-utils
- Pruebas de componentes: mount + assert
- Pruebas de stores: setState + assert actions
- Mockear Axios con `vi.mock('axios')`
