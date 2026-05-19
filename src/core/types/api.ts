export interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}

export interface ApiSuccess<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}
