import { isAxiosError } from 'axios'
import type { ApiError } from '@/types/api'

export interface ApiErrorInfo {
  detail: string | null
  status: number | null
}

export function getApiError(err: unknown): ApiErrorInfo {
  if (isAxiosError<ApiError>(err)) {
    const detail = err.response?.data?.detail
    return {
      detail: typeof detail === 'string' ? detail : null,
      status: err.response?.status ?? null,
    }
  }
  return { detail: null, status: null }
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const { detail } = getApiError(err)
  return detail ?? fallback
}
