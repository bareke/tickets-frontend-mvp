---
description: "Inicia una fase del frontend. Carga el contexto de la fase y feature_list.json para empezar a implementar. Uso: @start-phase F1-auth"
agent: general
---

## Iniciando fase: $ARGUMENTS

1. Lee `feature_list.json` — confirma que la fase `$ARGUMENTS` está en status `pending`.
2. Cambia su status a `in_progress`.
3. Lee `progress/current.md` y actualiza con: fecha, fase, plan breve.
4. Lee el skill `.opencode/skills/$ARGUMENTS/SKILL.md`.
5. Lee `docs/spects/05-implementation-plan.md` y busca la sección de la fase.
6. Ejecuta la implementación según los pasos del plan.
7. Documenta cada archivo creado/modificado en `progress/current.md`.
8. Al terminar: ejecuta `./init.sh post`.
9. Si pasa: cambia status a `done` en `feature_list.json`, mueve current a history.
