# AGENTS.md — Mapa de navegación para IA (opencode / Claude)

> Punto de entrada para cualquier agente que trabaje en este frontend.
> Este proyecto está optimizado para **opencode**, pero compatible con Claude Code.

---

## 1. Antes de empezar (obligatorio)

1. Lee `progress/current.md` — estado de la sesión anterior.
2. Lee `feature_list.json` — elige **una** fase con status `pending`. No trabajes en más de una a la vez.
3. Carga el skill de la fase con el comando: `@F0-scaffolding` (o `F1-auth`, `F2-profile`, etc.), o lee `.opencode/skills/<fase>/SKILL.md`.

## 2. Estructura del proyecto

| Ruta | Propósito |
|---|---|
| `feature_list.json` | 5 fases trackeadas (pending / in_progress / done) |
| `progress/current.md` | Estado de la sesión actual |
| `progress/history.md` | Bitácora append-only de sesiones anteriores |
| `docs/spects/` | Especificaciones fuente (NO MODIFICAR) |
| `.opencode/skills/F{0-4}-*/SKILL.md` | Skills cargables con `skill` tool / `@` comandos |
| `.opencode/agents/` | Agentes opencode: lider, implementador, revisor |
| `.opencode/commands/` | Comandos opencode: start-phase, verify-phase, close-session |
| `harness/architecture.md` | Stack, capas, flujo de datos |
| `harness/conventions.md` | Reglas de estilo y código |
| `harness/verification.md` | Checks por fase y gates |
| `init.sh` | `./init.sh pre` (pre-checks) / `./init.sh post` (post-checks) |

## 3. Skills disponibles

| Skill | Fase | Comando / File |
|---|---|---|
| F0-scaffolding | Inicializar proyecto, configurar herramientas, estructura | `.opencode/skills/F0-scaffolding/SKILL.md` |
| F1-auth | Registro, login, email, password, guards | `.opencode/skills/F1-auth/SKILL.md` |
| F2-profile | Perfil, avatar, roles | `.opencode/skills/F2-profile/SKILL.md` |
| F3-admin | CRUD de usuarios (admin) | `.opencode/skills/F3-admin/SKILL.md` |
| F4-polish | Toast, loading, responsive, refactor | `.opencode/skills/F4-polish/SKILL.md` |

En opencode, carga un skill con `skill` tool o usa `@F1-auth` en el chat si hay comandos configurados.

## 4. Reglas duras

- **Una fase a la vez.** No mezcles cambios de varias fases.
- **No declares `done` sin `./init.sh post` verde.** Si falla, bloquea.
- **Documenta en `progress/current.md` mientras trabajas**, no al final.
- **No modifiques `docs/spects/`** — son la especificación fuente. Discrepancias van a `progress/current.md`.
- **`./init.sh post` antes de cerrar.** Si falla, no cierres.
- Después de cerrar sesión: `progress/current.md` debe quedar con la plantilla limpia.

## 5. Ciclo de vida de una sesión

```
1. Leer progress/current.md + feature_list.json
2. Elegir fase pending → marcar in_progress
3. Cargar skill de la fase
4. Leer docs/spects/ relevantes + harness/ (opcional según contexto)
5. Implementar secuencialmente (una tarea a la vez)
6. Documentar en progress/current.md
7. Ejecutar ./init.sh post
8. Si pasa: mark done, mover current → history, limpiar current
9. Siguiente fase
```

## 6. Agentes opencode (subagentes)

| Agente | Rol |
|---|---|
| `lider` | Orquesta fases, no implementa. Asigna, verifica, actualiza tracking. |
| `implementador` | Implementa componentes, stores, API, vistas. |
| `revisor` | Revisa contra specs y convenciones. No escribe código. |

Uso: `task` con `subagent_type` igual al nombre del agente.

## 7. Comandos opencode

| Comando | Uso |
|---|---|
| `@start-phase F1-auth` | Inicia una fase: carga contexto, implementa, verifica |
| `@verify-phase` | Ejecuta `init.sh post` + muestra progreso |
| `@close-session` | Cierra sesión: verifica, mueve current → history, limpia |
