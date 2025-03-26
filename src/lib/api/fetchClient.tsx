'use client'

import {ApiError} from 'next/dist/server/api-utils'
import {
  ApiResponseWithData,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  Response
} from './type'

type FetchOptions<TBody = unknown> = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: Record<string, string>
  body?: TBody
  withAuth?: boolean
  contentType?: string
  params?: Record<string, string>
}

export class FetchClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<TResponse = undefined, TBody = unknown>(
    url: string,
    options: FetchOptions<TBody>
  ): Promise<TResponse> {
    const {
      withAuth = false,
      contentType = 'application/json',
      headers,
      body,
      params,
      ...restOptions
    } = options

    const allHeaders = new Headers(
      Object.assign(
        {
          'Content-Type': contentType
        },
        headers
      )
    )

    let queryString = ''
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      queryString = `?${searchParams.toString()}`
    }

    const response = await fetch(`${this.baseUrl}${url}${queryString}`, {
      ...restOptions,
      headers: allHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      throw new ApiError(errorData.status, errorData.message)
    }
    const data = await response.json()

    return data
  }

  public get<TResponse>(url: string, options?: FetchOptions) {
    return this.request<TResponse>(url, {method: 'GET', ...options})
  }

  public post<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, {method: 'POST', ...options})
  }

  public put<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, {method: 'PUT', ...options})
  }

  public patch<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, {method: 'PATCH', ...options})
  }

  public delete<TResponse>(url: string, options?: FetchOptions) {
    return this.request<TResponse>(url, {method: 'DELETE', ...options})
  }
}
