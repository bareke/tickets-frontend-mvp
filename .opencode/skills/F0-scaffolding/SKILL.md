---
name: F0-scaffolding
description: "Use when implementing Fase 0 of the frontend: scaffolding, Vite + Vue 3 + TypeScript init, Tailwind, shadcn-vue, Axios, Pinia, Vue Router, Zod, project structure, types, schemas, and Vite proxy config."
---

# Fase 0 — Scaffolding y Configuración Inicial

Lee `docs/spects/05-implementation-plan.md#fase-0` para la spec completa.

## Pasos

1. `npm create vite@latest . -- --template vue-ts`
2. `npm install vue-router@4 pinia axios zod date-fns lucide-vue-next`
3. `npm install -D tailwindcss@3 postcss autoprefixer`
4. Configurar Tailwind (`tailwind.config.ts`, `postcss.config.js`, `main.css`)
5. `npx shadcn-vue@latest init`
6. Añadir componentes shadcn-vue: `npx shadcn-vue@latest add button input card form label alert toast dialog table badge select skeleton`
7. Crear carpetas: `src/{api,components/{ui,auth,profile,admin,shared},composables,layouts,lib,router,stores,types,views/{auth,profile,admin}}`
8. Crear `src/api/client.ts` con Axios + interceptores (token, 401 redirect, 403 handling)
9. Crear `src/router/index.ts` con rutas placeholder + `src/router/guards.ts`
10. Crear `src/types/api.ts` con todas las interfaces (ver `docs/spects/03-data-models.md`)
11. Crear `src/lib/validators.ts` con schemas Zod (register, login, profile, reset-password)
12. Configurar proxy `/api` → `http://localhost:8000` en `vite.config.ts`

## Verificación
```bash
npm run dev    # Sin errores
npm run build  # Sin errores
```
