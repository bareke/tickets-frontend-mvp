---
description: "Verifica el estado actual del frontend. Ejecuta init.sh post y muestra el progreso de feature_list.json. Uso: @verify-phase"
agent: general
---

## Verificando estado del proyecto

1. Ejecuta `./init.sh post`.
2. Lee `feature_list.json` y muestra resumen de fases:
   - Fases completadas (done)
   - Fase en curso (in_progress)
   - Fases pendientes (pending)
3. Lee `progress/current.md` y muestra el estado de la sesión actual.
