import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { LocalStorage } from '@/shared/helpers'

const TOKEN_KEY = 'auth_token'

const api = axios.create({
  baseURL: '/api',
})

// Interceptor de requisição: adiciona token do localStorage no header Authorization
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = LocalStorage.get<string>(TOKEN_KEY)
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de resposta: trata erros 401 e faz logout automático
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Limpar token do localStorage
      if (typeof window !== 'undefined') {
        LocalStorage.remove(TOKEN_KEY)
        // Redirecionar para login apenas se estiver no cliente
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export { api }
