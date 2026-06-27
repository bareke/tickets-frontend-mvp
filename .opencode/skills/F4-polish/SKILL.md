---
name: F4-polish
description: "Use when implementing Fase 4: polish and finalization — global error handling (toast/snackbar), loading states, skeletons, responsive design, and final review. Requires Fases 1-3 to be completed."
---

# Fase 4 — Polish y Finalización

Lee `docs/spects/05-implementation-plan.md#fase-4` para la spec completa.

## Tareas

1. Toast/snackbar para operaciones exitosas y errores (usar shadcn-vue Sonner o Toast)
2. Loading states: `LoadingSpinner.vue` en vistas, skeletons en tablas
3. Empty states: mensajes cuando no hay datos ("No hay usuarios", etc.)
4. Responsive: sidebar colapsable, tablas con scroll horizontal, formularios en columna
5. Refactor final: revisar imports circulares, estados faltantes, títulos de página

## Verificación final
```bash
npm run build
npx vue-tsc --noEmit
grep -r "console.log" src/ --include="*.ts" --include="*.vue" || true  # revisar
```

Recorrer todas las vistas probando: loading, empty, error, success states.
