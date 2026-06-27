---
name: F3-admin
description: "Use when implementing Fase 3: admin module — user CRUD for administrators (list, create, edit, delete users). Requires Fase 1 (auth) to be completed first. Backend needs an admin user."
---

# Fase 3 — Administración (Admin Module)

Lee `docs/spects/05-implementation-plan.md#fase-3` para la spec completa.
Lee `docs/spects/06-component-specs.md` para specs de componentes.
Lee `docs/spects/07-state-management.md` para el store admin.

## API Layer (`src/api/users.ts`)
- `getUsers()`, `getUser(id)`, `createUser(data)`, `updateUser(id, data)`, `deleteUser(id)`

## Store (`src/stores/admin.ts`)
- State: users, selectedUser, loading, error
- Actions: fetchUsers, fetchUser, createUser, updateUser, deleteUser

## Composable (`src/composables/useUsers.ts`)
- Wrapper reactivo sobre admin store

## Vistas
- `UsersListView.vue` — tabla con acciones
- `UserDetailView.vue` — detalle de usuario (opcional)

## Componentes
- `UserTable.vue` — tabla responsiva con sort, loading, empty, error
- `UserCreateDialog.vue` — modal de creación con formulario
- `UserEditDialog.vue` — modal de edición pre-poblado

## Router + Guards
- Guard `requiresAdmin` — verificar userRoles.includes('admin')
- Rutas admin protegidas con `requiresAuth` + `requiresAdmin`
