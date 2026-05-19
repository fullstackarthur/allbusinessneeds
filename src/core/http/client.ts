import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { HttpClient, HttpResponse, RequestConfig } from '@/core/types/http'
import { AppError, NetworkError, AuthenticationError } from '@/core/errors'
import { API_BASE_URL, API_TIMEOUT } from '@/core/constants'

function toHttpResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
  return {
    data: response.data,
    status: response.status,
    headers: Object.fromEntries(Object.entries(response.headers)),
  }
}

function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new NetworkError(error.message)
    }

    const status = error.response.status
    const message = error.response.data?.message || error.response.data?.error?.message || 'Request failed'

    switch (status) {
      case 401:
        throw new AuthenticationError(message)
      case 404:
        throw new AppError(message, 404)
      case 422:
        throw new AppError(message, 422)
      default:
        throw new AppError(message, status)
    }
  }

  if (error instanceof Error) {
    throw new AppError(error.message)
  }

  throw new AppError('An unexpected error occurred')
}

export class AxiosHttpClient implements HttpClient {
  private instance: AxiosInstance

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAuthToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => Promise.reject(handleAxiosError(error)),
    )
  }

  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('abn_auth_token')
    } catch {
      return null
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, this.toAxiosConfig(config))
      return toHttpResponse(response)
    } catch (error) {
      return handleAxiosError(error)
    }
  }

  async post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, body, this.toAxiosConfig(config))
      return toHttpResponse(response)
    } catch (error) {
      return handleAxiosError(error)
    }
  }

  async put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, body, this.toAxiosConfig(config))
      return toHttpResponse(response)
    } catch (error) {
      return handleAxiosError(error)
    }
  }

  async patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.patch<T>(url, body, this.toAxiosConfig(config))
      return toHttpResponse(response)
    } catch (error) {
      return handleAxiosError(error)
    }
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url, this.toAxiosConfig(config))
      return toHttpResponse(response)
    } catch (error) {
      return handleAxiosError(error)
    }
  }

  private toAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
    if (!config) return {}
    const { headers, signal, timeout } = config
    return { headers, signal, timeout }
  }
}

export const httpClient = new AxiosHttpClient()
