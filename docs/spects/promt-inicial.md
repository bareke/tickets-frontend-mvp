## Contexto
Tienes acceso a dos repositorios:
- **Backend:** `tickects-backend-mvp` — API REST/GraphQL (determinar protocolo) que gestiona el sistema de tickets.
- **Frontend:** Repositorio vacío donde debes iniciar un proyecto Vue 3 + TypeScript.

## Objetivo
Analizar exhaustivamente el repositorio backend y generar un **Plan de Implementación Frontend** faseado, detallado y ejecutable. Este plan debe permitir que cualquier IA o desarrollador pueda construir el frontend conectándose correctamente al backend.

---

## FASE 1: Análisis del Backend (Descubrimiento)

Ejecuta un análisis profundo del repo `tickects-backend-mvp` y documenta:

### 1.1 Arquitectura & Tecnología
- [ ] Lenguaje y framework (Node.js/Express, Python/FastAPI, etc.)
- [ ] Base de datos y ORM utilizado
- [ ] Autenticación y autorización (JWT, OAuth, sesiones, roles)
- [ ] Validaciones de entrada (librerías como Zod, Joi, class-validator)

### 1.2 Endpoints & Contratos de API
- [ ] Listar **TODOS** los endpoints disponibles (GET, POST, PUT, DELETE, PATCH)
- [ ] Para cada endpoint documentar:
  - URL completa
  - Headers requeridos (incluyendo auth)
  - Body de request (tipo, campos obligatorios/opcionales, validaciones)
  - Response de éxito (estructura JSON, códigos HTTP)
  - Response de error (estructura de errores, códigos HTTP)
- [ ] Enumerar todos los **DTOs/Schemas/Models** del backend

### 1.3 Modelos de Dominio
- [ ] Identificar todas las entidades (ej: User, Ticket, Comment, Category)
- [ ] Relaciones entre entidades (1:N, N:M)
- [ ] Estados/lifecycles de cada entidad (ej: Ticket: open → in_progress → resolved → closed)
- [ ] Campos calculados o derivados

### 1.4 Lógica de Negocio
- [ ] Reglas de negocio críticas (quién puede crear/editar/eliminar qué)
- [ ] Flujos de trabajo (workflows) principales
- [ ] Notificaciones o eventos (WebSockets, SSE, webhooks)
- [ ] Lógica de permisos por rol

### 1.5 Assets & Recursos
- [ ] Manejo de archivos (uploads, imágenes, adjuntos)
- [ ] Configuración de CORS y variables de entorno relevantes para el front

---

## FASE 2: Diseño del Frontend (Arquitectura)

Basado en el análisis del backend, define:

### 2.1 Stack Técnico
- **Framework:** Vue 3 (Composition API + `&lt;script setup&gt;`)
- **Lenguaje:** TypeScript (estricto)
- **Estado:** Pinia (stores modulares por dominio)
- **Routing:** Vue Router 4
- **HTTP Client:** Axios con interceptores
- **UI Components:** shadcn-vue (https://ui.shadcn.com/)
- **Validación:** Zod (para mantener parity con el backend)
- **Estilos:** Tailwind CSS
- **Utilidades:** date-fns, lucide-vue-next (iconos)

### 2.2 Estructura de Carpetas
frontend/
├── src/
│   ├── api/              # Cliente HTTP + endpoints tipados
│   ├── components/       # Componentes Vue (shadcn + custom)
│   ├── composables/      # Lógica reutilizable (useAuth, useTickets)
│   ├── layouts/          # Layouts de página
│   ├── lib/              # Utilidades, helpers, formatters
│   ├── router/           # Configuración de rutas + guards
│   ├── stores/           # Pinia stores (auth, tickets, ui)
│   ├── types/            # Interfaces TypeScript (mirror del backend)
│   ├── views/            # Páginas/Vistas
│   └── App.vue
├── docs/spects                 # ← DOCUMENTACIÓN PARA IA
│   ├── 01-backend-analysis.md
│   ├── 02-api-contracts.md
│   ├── 03-data-models.md
│   ├── 04-frontend-architecture.md
│   ├── 05-implementation-plan.md
│   ├── 06-component-specs.md
│   └── 07-state-management.md
└── ...