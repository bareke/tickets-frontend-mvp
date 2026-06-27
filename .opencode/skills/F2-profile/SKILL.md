---
name: F2-profile
description: "Use when implementing Fase 2: profile module — view and edit profile, avatar upload, role management (buyer/seller toggle). Requires Fase 1 (auth) to be completed first."
---

# Fase 2 — Perfil de Usuario (Profile Module)

Lee `docs/spects/05-implementation-plan.md#fase-2` para la spec completa.
Lee `docs/spects/06-component-specs.md` para specs de componentes.
Lee `docs/spects/07-state-management.md` para el store profile.

## API Layer (`src/api/profile.ts`)
- `getProfile()`, `updateProfile(data)`, `uploadAvatar(file)`, `addRole(role)`

## Store (`src/stores/profile.ts`)
- State: profile, loading, error, uploadProgress
- Actions: fetchProfile, updateProfile, uploadAvatar, addRole

## Composable (`src/composables/useProfile.ts`)
- Wrapper reactivo sobre profile store

## Vista
- `ProfileView.vue` — datos + edición + avatar + roles

## Componentes
- `ProfileCard.vue` — avatar, nombre, email, roles badges
- `ProfileEditForm.vue` — formulario inline name/lastname/phone
- `AvatarUpload.vue` — dropzone, preview, validación JPG/PNG 2MB
- `RoleSelector.vue` — botón "Convertirse en vendedor"

## Router
- Ruta `/profile` protegida con `requiresAuth`
