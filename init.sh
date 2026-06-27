#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# tickets-frontend — Init / Verify Script
# ──────────────────────────────────────────────
# Uso:
#   ./init.sh pre   → Verifica que el entorno está listo antes de trabajar
#   ./init.sh post  → Verifica que todo está correcto antes de cerrar
#   ./init.sh       → Ejecuta pre y post
# ──────────────────────────────────────────────

MODE="${1:-all}"
PASS=0
FAIL=0

pass() { PASS=$((PASS + 1)); echo "  [PASS] $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  [FAIL] $1"; }

pre_checks() {
    echo ""
    echo "══════════════════════════════════════════"
    echo "  PRE-FEATURE CHECKS"
    echo "══════════════════════════════════════════"

    # 1. Node.js disponible
    if command -v node &> /dev/null; then
        pass "Node.js $(node -v)"
    else
        fail "Node.js no instalado"
    fi

    # 2. npm disponible
    if command -v npm &> /dev/null; then
        pass "npm $(npm -v)"
    else
        fail "npm no instalado"
    fi

    # 3. node_modules existe
    if [ -d "node_modules" ]; then
        pass "node_modules existe"
    else
        fail "node_modules no existe — ejecuta 'npm install'"
    fi

    # 4. package.json existe
    if [ -f "package.json" ]; then
        pass "package.json existe"
    else
        fail "package.json no encontrado — ¿proyecto inicializado?"
    fi

    # 5. Estructura de carpetas src/
    for dir in api components composables layouts lib router stores types views; do
        if [ -d "src/$dir" ]; then
            pass "src/$dir/ existe"
        else
            fail "src/$dir/ no existe"
        fi
    done

    # 6. docs/spects/ existe
    if [ -d "docs/spects" ]; then
        pass "docs/spects/ existe"
    else
        fail "docs/spects/ no existe"
    fi
}

post_checks() {
    echo ""
    echo "══════════════════════════════════════════"
    echo "  POST-FEATURE CHECKS"
    echo "══════════════════════════════════════════"

    # 1. Build limpio
    echo ""
    echo "  ——— npm run build ———"
    if npm run build &>/dev/null; then
        pass "Build exitoso"
    else
        fail "Build falló — revisa errores"
    fi

    # 2. TypeScript check (si vue-tsc está configurado)
    if grep -q '"typecheck"' package.json 2>/dev/null || grep -q '"vue-tsc"' package.json 2>/dev/null; then
        echo ""
        echo "  ——— vue-tsc ———"
        if npx vue-tsc --noEmit &>/dev/null; then
            pass "TypeScript check exitoso"
        else
            fail "TypeScript check falló — revisa errores de tipos"
        fi
    else
        echo "  [SKIP] vue-tsc no configurado en package.json"
    fi

    # 3. Sin console.log de debug
    echo ""
    FOUND_LOGS=$(grep -rn "console.log" src/ --include="*.ts" --include="*.vue" 2>/dev/null || true)
    if [ -z "$FOUND_LOGS" ]; then
        pass "Sin console.log de debug en src/"
    else
        echo "  [WARN] console.log encontrados — revisar si son de debug:"
        echo "$FOUND_LOGS" | sed 's/^/        /'
    fi

    # 4. feature_list.json sin in_progress (debe estar done o pending)
    IN_PROGRESS=$(python3 -c "
import json
with open('feature_list.json') as f:
    data = json.load(f)
in_progress = [f['name'] for f in data['features'] if f['status'] == 'in_progress']
if in_progress:
    print('\n'.join(in_progress))
" 2>/dev/null || echo "")
    if [ -z "$IN_PROGRESS" ]; then
        pass "No hay fases en in_progress"
    else
        fail "Fases aún en in_progress: $IN_PROGRESS"
    fi

    # 5. progress/current.md está vacío o tiene la plantilla
    if [ -f "progress/current.md" ]; then
        CURRENT_CONTENT=$(grep -c "Sin fase en curso" progress/current.md 2>/dev/null || true)
        if [ "$CURRENT_CONTENT" -gt 0 ]; then
            pass "progress/current.md está en estado limpio"
        else
            echo "  [WARN] progress/current.md tiene contenido — ¿olvidaste moverlo a history?"
        fi
    else
        fail "progress/current.md no existe"
    fi
}

# ── Main ──────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     tickets-frontend — Init Script       ║"
echo "╚══════════════════════════════════════════╝"

case "$MODE" in
    pre)
        pre_checks
        ;;
    post)
        post_checks
        ;;
    all)
        pre_checks
        post_checks
        ;;
    *)
        echo "Uso: $0 {pre|post|all}"
        exit 1
        ;;
esac

echo ""
echo "══════════════════════════════════════════"
echo "  Resumen: $PASS passed, $FAIL failed"
echo "══════════════════════════════════════════"
echo ""

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
exit 0
