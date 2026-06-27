# 02 — Contratos de API

> Prefijo base: `/api/v1`
> Servidor: `http://localhost:8000` (desarrollo)
> Formato: JSON
> Auth: Bearer Token JWT en header `Authorization`

---

## 1. Auth — Registro

### `POST /api/v1/auth/register`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "Password1",
  "name": "Juan",
  "lastname": "Pérez",
  "phone": "1234567890"
}
```

**Validaciones:**
- `password`: mínimo 8 chars, 1 mayúscula, 1 minúscula, 1 dígito
- `phone`: opcional, 7-15 dígitos
- `email`: debe ser único en el sistema

**Response 201:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Juan",
  "lastname": "Pérez",
  "roles": ["buyer"],
  "email_verified": false,
  "phone": "1234567890",
  "avatar_url": null,
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T10:30:00Z",
  "deleted_at": null
}
```

**Response 409:**
```json
{ "detail": "Email already registered" }
```

**Response 422:** Errores de validación de Pydantic.

---

## 2. Auth — Verificar Email

### `GET /api/v1/auth/verify-email?token=<uuid>`

**Response 200:**
```json
{ "message": "Email verified successfully" }
```

**Response 400:**
```json
{ "detail": "Invalid or already used token" }
```
```json
{ "detail": "Token expired" }
```

---

## 3. Auth — Reenviar verificación

### `POST /api/v1/auth/resend-verification`

**Request body:**
```json
{ "email": "user@example.com" }
```

**Response 200:**
```json
{ "message": "Verification email sent" }
```

**Response 400:**
```json
{ "detail": "Email already verified" }
```

---

## 4. Auth — Login

### `POST /api/v1/auth/login`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "Password1"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Response 401:**
```json
{ "detail": "Invalid credentials" }
```

**Response 403:**
```json
{ "detail": "Email not verified" }
```

**Nota:** `expires_in` está en segundos. El JWT payload contiene: `sub` (user_id string), `email`, `roles` (array string), `exp` (timestamp).

---

## 5. Auth — Logout

### `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{ "message": "Logged out successfully" }
```

**Response 401:**
```json
{ "detail": "Invalid or expired token" }
```

**Nota:** Logout es stateless (el frontend debe descartar el token localmente).

---

## 6. Auth — Olvidé mi contraseña

### `POST /api/v1/auth/forgot-password`

**Request body:**
```json
{ "email": "user@example.com" }
```

**Response 200** (siempre, para no revelar si el email existe):
```json
{ "message": "If this email exists, a reset link has been sent" }
```

---

## 7. Auth — Restablecer contraseña

### `POST /api/v1/auth/reset-password`

**Request body:**
```json
{
  "token": "uuid-del-token",
  "new_password": "NewPass1"
}
```

**Response 200:**
```json
{ "message": "Password reset successfully" }
```

**Response 400:**
```json
{ "detail": "Invalid token" }
```
```json
{ "detail": "Token already used" }
```
```json
{ "detail": "Token expired" }
```

---

## 8. Profile — Obtener perfil

### `GET /api/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Juan",
  "lastname": "Pérez",
  "roles": ["buyer", "seller"],
  "email_verified": true,
  "phone": "1234567890",
  "avatar_url": "media/avatars/1.jpg",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T12:00:00Z",
  "deleted_at": null
}
```

---

## 9. Profile — Actualizar perfil

### `PATCH /api/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Request body** (todos opcionales):
```json
{
  "name": "Juan Carlos",
  "lastname": "Pérez García",
  "phone": "0987654321"
}
```

**Response 200:** Mismo schema que `GET /users/me`.

---

## 10. Profile — Subir foto

### `POST /api/v1/users/me/photo`

**Headers:** `Authorization: Bearer <token>` | `Content-Type: multipart/form-data`

**Request:** campo `file` con imagen JPG o PNG.

**Response 200:**
```json
{ "avatar_url": "media/avatars/1.jpg" }
```

**Response 422:**
```json
{ "detail": "Only JPG and PNG files are allowed" }
```
```json
{ "detail": "File exceeds 2 MB limit" }
```

---

## 11. Profile — Añadir rol

### `POST /api/v1/users/me/roles`

**Headers:** `Authorization: Bearer <token>`

**Request body:**
```json
{ "role": "seller" }
```

**Response 200:**
```json
{ "roles": ["buyer", "seller"] }
```

**Response 409:**
```json
{ "detail": "Role already assigned" }
```

---

## 12. Admin — Listar usuarios

### `GET /api/v1/users`

**Response 200:** Array de `UserPublic` (mismo schema que `GET /users/me`).

---

## 13. Admin — Obtener usuario

### `GET /api/v1/users/{id}`

**Response 200:** Objeto `UserPublic`.

**Response 404:**
```json
{ "detail": "User not found" }
```

---

## 14. Admin — Crear usuario

### `POST /api/v1/users`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "Password1",
  "name": "Juan",
  "lastname": "Pérez",
  "role": "buyer"
}
```

**Response 201:** Objeto `UserPublic`.

---

## 15. Admin — Actualizar usuario

### `PUT /api/v1/users/{id}`

**Request body:**
```json
{
  "email": "new@example.com",
  "password": "NewPass1",
  "name": "Nuevo",
  "lastname": "Nombre",
  "role": "seller"
}
```

**Response 200:** Objeto `UserPublic`.

**Response 404:**
```json
{ "detail": "User not found" }
```

---

## 16. Admin — Eliminar usuario

### `DELETE /api/v1/users/{id}`

**Response 200:** Objeto `UserPublic` del usuario eliminado (soft delete).

**Response 404:**
```json
{ "detail": "User not found" }
```

---

## Estructura de Errores

### Error de autenticación (401)
```json
{ "detail": "Invalid or expired token" }
```

### Error de validación (422)
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "at least 8 characters required",
      "type": "value_error"
    }
  ]
}
```

### Error de conflicto (409)
```json
{ "detail": "Email already registered" }
```

### Error de solicitud (400)
```json
{ "detail": "Invalid or already used token" }
```

### No encontrado (404)
```json
{ "detail": "User not found" }
```
