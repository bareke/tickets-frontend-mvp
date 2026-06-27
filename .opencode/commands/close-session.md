---
description: "Cierra la sesión actual: ejecuta init.sh post, y si la fase actual está completa, mueve progress/current.md a progress/history.md y limpia current.md. Uso: @close-session"
agent: general
---

## Cerrando sesión

1. Ejecuta `./init.sh post`.
2. Si falla: NO hagas nada más. Reporta los fallos.
3. Si pasa:
   - Lee `feature_list.json` y verifica que la fase actual está marcada `done` o `pending`.
   - Si está `in_progress` y quieres cerrar sin completarla, déjala como `in_progress`.
   - Si está `done`: mueve el contenido de `progress/current.md` al final de `progress/history.md`.
   - Limpia `progress/current.md` dejando solo la plantilla:
     ```
     # Sesión actual

     **Inicio:** —
     **Fase:** —
     **Plan breve:** —

     ---

     ## Notas de implementación



     ## Bloqueos / pendientes



     ---

     _Sin fase en curso. Elige la próxima de `feature_list.json`._
     ```
4. Resumen final: qué fases están hechas, cuál sigue.
