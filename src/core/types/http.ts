export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestConfig {
  headers?: Record<string, string>
  signal?: AbortSignal
  timeout?: number
}

export interface HttpResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>
  post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>
  put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>
  patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>
  delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>
}
