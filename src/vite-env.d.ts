/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base para las peticiones de Axios. Por defecto: '/api/v1'. */
  readonly VITE_API_BASE_URL?: string
  /** Target del proxy de Vite hacia el backend (solo dev). Por defecto: 'http://localhost:8000'. */
  readonly VITE_BACKEND_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
