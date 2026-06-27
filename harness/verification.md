# Verification — tickets-frontend

## Cómo verificar cada fase

### Nivel 0 — Integridad del proyecto
```bash
# El proyecto compila sin errores
npm run build

# El servidor de desarrollo arranca
npm run dev &
# timeout 5s && curl http://localhost:5173
# Debe responder con HTML

# La estructura de carpetas existe
ls -d src/api src/components src/composables src/layouts src/lib src/router src/stores src/types src/views
```

### Nivel 1 — Verificación contra backend

Cada fase debe verificarse contra el backend real en ejecución:

```bash
# 1. Backend corriendo en localhost:8000
# 2. Frontend corriendo en localhost:5173
# 3. Probar flujo manualmente o con curl
```

### Nivel 2 — Gate PRE-FEATURE

Antes de empezar una fase:

```bash
npm run build    # El proyecto compila
npm run typecheck  # Sin errores de tipos (si está configurado)
git status       # No hay cambios sin commitear de fases anteriores
```

### Nivel 3 — Gate POST-FEATURE

Antes de marcar una fase como `done`:

```bash
# 1. Build limpio
npm run build --noEmit

# 2. Lint
npx vue-tsc --noEmit

# 3. Verificar que no hay console.log de debug
grep -r "console.log" src/ --include="*.ts" --include="*.vue" || true
# Revisar manualmente que no haya logs de debug

# 4. Verificar estructura contra la especificación
# - Los archivos creados coinciden con lo especificado en docs/spects/05-implementation-plan.md
# - La feature completa los acceptance criteria

# 5. Probar contra backend (si está disponible)
# curl o pruebas manuales de los endpoints involucrados
```

## Check por fase

### Fase 0 — Scaffolding
- [ ] `npm run dev` arranca sin errores
- [ ] `npm run build` compila exitosamente
- [ ] Estructura de carpetas completa
- [ ] Axios client con interceptores
- [ ] Vue Router con rutas base
- [ ] Tipos TypeScript creados
- [ ] Schemas Zod creados
- [ ] Proxy configurado en vite.config.ts

### Fase 1 — Auth
- [ ] Registro funciona (POST /auth/register)
- [ ] Login funciona y guarda token (POST /auth/login)
- [ ] 403 email no verificado se muestra al usuario
- [ ] Verificación de email funciona (GET /auth/verify-email)
- [ ] Reenvío de verificación funciona
- [ ] Forgot/reset password funciona
- [ ] Logout funciona y limpia token
- [ ] Guards redirigen correctamente
- [ ] Interceptor 401 redirige a login

### Fase 2 — Profile
- [ ] GET /users/me muestra perfil
- [ ] PATCH /users/me actualiza datos
- [ ] Upload avatar funciona (POST /users/me/photo)
- [ ] Add role funciona (POST /users/me/roles)
- [ ] Los cambios persisten al recargar

### Fase 3 — Admin
- [ ] Listado de usuarios (GET /users)
- [ ] Crear usuario (POST /users)
- [ ] Editar usuario (PUT /users/{id})
- [ ] Eliminar usuario (DELETE /users/{id})
- [ ] Guard admin bloquea a no-admin

### Fase 4 — Polish
- [ ] Loading states en todas las vistas
- [ ] Empty states en tablas
- [ ] Error states con mensajes claros
- [ ] Responsive en mobile
- [ ] Toast para operaciones exitosas
