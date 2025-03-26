import Error from 'next/error'

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Response<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export interface AuthResponse {
  ok: boolean
  body: string
}

export interface ErrorResponse {
  error: string
  message: string
  status: number
  details?: string
}

export interface ApiResponse {
  status: number
  code: string
}

export interface ApiError extends Error {
  error: string
  messgage: string
  status: string
  details?: string
}

export type ApiResponseWithData<T> = ApiResponse & {
  data: T
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
