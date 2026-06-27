# 01 — Análisis del Backend

## Stack Tecnológico

| Componente | Tecnología | Versión |
|---|---|---|
| Lenguaje | Python | >= 3.10 |
| Framework web | FastAPI + Uvicorn | 0.129+ |
| ORM | Prisma Client Python | 0.15+ |
| Base de datos | PostgreSQL | 16 |
| Validación | Pydantic v2 | 2.12+ |
| Autenticación | JWT (python-jose[cryptography]) | 3.5+ |
| Hashing | bcrypt | 4.0+ |
| Gestor de paquetes | uv | — |
| Contenerización | Docker + Docker Compose | — |
| Tests | pytest + pytest-asyncio + httpx2 | — |

## Arquitectura

El backend implementa **Arquitectura Hexagonal** (Clean Architecture) con **Monolito Modular**:

```
app/
├── settings/              # Configuración global
│   ├── auth.py            # Dependencia FastAPI get_current_user
│   ├── database.py        # Singleton Prisma + connect/disconnect
│   ├── environment.py     # Variables de entorno
│   ├── jwt_utils.py       # Crear y decodificar JWT
│   ├── mailer.py          # Envío de emails (simulado con logger)
│   ├── modules.py         # Registro central de routers
│   └── security.py        # Hash y verificación bcrypt
│
└── users/                 # Módulo de usuarios
    ├── api.py             # Interfaz pública del módulo (__all__ explícito)
    ├── domain/
    │   ├── model.py       # Entidad User (clase Python plana)
    │   ├── abstract_repository.py
    │   ├── abstract_token_repository.py
    │   └── abstract_password_reset_repository.py
    ├── application/
    │   ├── validations.py # Schemas Pydantic (request/response)
    │   └── use_cases/     # 17 casos de uso
    └── infrastructure/
        ├── routers.py           # CRUD de usuarios
        ├── auth_routers.py      # Auth endpoints
        ├── profile_routers.py   # Perfil y roles
        ├── repository.py        # Implementación Prisma de UserRepository
        ├── token_repository.py  # Implementación Prisma de TokenRepository
        └── password_reset_repository.py
```

### Flujo de una petición

```
HTTP Request → routers.py → UseCase.execute() → Repository → Prisma → PostgreSQL
                                                  ↓
                                             Pydantic schema serializa respuesta
```

## Autenticación y Autorización

### Registro
- `POST /api/v1/auth/register` — crea usuario con rol `buyer` por defecto
- Contraseña hasheada con bcrypt (nunca se almacena en texto plano)
- `email_verified` se establece en `false`
- Se genera un token de verificación (UUID) con expiración de 24h

### Login
- `POST /api/v1/auth/login` — valida email + password contra hash bcrypt
- Si `email_verified = false` → `403 Forbidden`
- Si credenciales inválidas → `401 Unauthorized`
- Éxito → devuelve JWT con payload: `sub` (user_id), `email`, `roles`, `exp`

### JWT
- Algoritmo: HS256
- Payload: `{ sub: str(user_id), email: str, roles: list[str], exp: timestamp }`
- Tiempo de expiración por defecto: 60 minutos (configurable vía `JWT_EXPIRE_MINUTES`)
- Secreto configurable vía `JWT_SECRET`

### Protección de rutas
- `get_current_user` en `app/settings/auth.py` — dependencia FastAPI que valida el Bearer token
- Devuelve `401` si el token es inválido o expirado
- El JWT se extrae del header `Authorization: Bearer <token>`

## Validaciones de Entrada

Todas las validaciones ocurren en schemas **Pydantic v2** en `app/users/application/validations.py`:

| Campo | Regla |
|---|---|
| password | Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 dígito |
| email | String válido (validación nativa de Pydantic + email-validator) |
| phone | Opcional, 7-15 dígitos (solo dígitos, sin espacios/guiones) |
| role | Enum: `buyer`, `seller`, `admin` |
| name / lastname | Strings con trim de whitespace |
| avatar | Solo JPG/PNG, máximo 2 MB |

### Configuración de modelos
- `str_strip_whitespace: true` en todos los schemas de request
- `extra: "forbid"` — rechaza campos no definidos en el schema

## Variables de Entorno Relevantes para el Frontend

| Variable | Propósito |
|---|---|
| `JWT_EXPIRE_MINUTES` | Tiempo de vida del token (default 60) — el frontend debe conocerlo para refresh |
| `PORT` | Puerto del servidor (default 8000) |
| `DATABASE_URL` | Solo backend |

## CORS

No se ha encontrado configuración explícita de CORS en el backend. El frontend deberá considerar esto durante el desarrollo y solicitar su configuración (orígenes permitidos) o usar un proxy de Vite.

## Manejo de Archivos

- Upload de avatar: `POST /api/v1/users/me/photo`
- Almacenamiento local en `media/avatars/<user_id>.<ext>`
- Validación: solo JPG/PNG, máximo 2 MB
- La ruta relativa se guarda en el campo `avatar_url` de la tabla `users`

## Notificaciones

- No hay WebSockets, SSE ni webhooks implementados
- El envío de emails es simulado con `logging.info()` en `app/settings/mailer.py`
- La interfaz `send_email(to, subject, body)` está lista para ser reemplazada por un servicio real
