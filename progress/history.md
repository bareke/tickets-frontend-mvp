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

