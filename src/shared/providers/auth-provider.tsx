'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { authService } from '@/features/auth/services/auth-service'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { LocalStorage } from '@/shared/helpers'

interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isError: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'

const authRoutes = new Set(['/auth/login', '/auth/register'])

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  // Estado reativo para o token
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Inicializar token do localStorage
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const savedToken = LocalStorage.get<string>(TOKEN_KEY)
      setToken(savedToken)
      setIsInitialized(true)

      // Redirecionar imediatamente se não houver token e não estiver em rota de auth
      if (!savedToken && !authRoutes.has(pathname)) {
        router.replace('/auth/login')
      }
    }
  }, [pathname, router])

  // useGetMe integrado no provider
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      const result = await authService.getMe()
      return result.user
    },
    enabled: !!token,
    retry: false,
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (token) {
        await authService.logout()
      }
    },
    onSuccess: () => {
      // Limpar token do localStorage e estado
      LocalStorage.remove(TOKEN_KEY)
      setToken(null)
      // Limpar cache do React Query
      queryClient.clear()
      // Redirecionar para login
      router.push('/auth/login')
    },
    onError: () => {
      // Mesmo em caso de erro, limpar localmente
      LocalStorage.remove(TOKEN_KEY)
      setToken(null)
      queryClient.clear()
      router.push('/auth/login')
    },
  })

  const login = useCallback(
    (newToken: string, _: User) => {
      LocalStorage.set(TOKEN_KEY, newToken)
      setToken(newToken)
      // Invalidar query para forçar refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] })
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  // Se houver erro ao buscar dados do usuário, fazer logout
  useEffect(() => {
    if (isError && token) {
      logout()
    }
  }, [isError, token, logout])

  const contextValue = useMemo(
    () => ({
      user: user || null,
      token,
      isLoading,
      isError,
      login,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, isLoading, isError, login, logout],
  )

  // Não renderizar conteúdo se não houver token e não estiver em rota de auth
  if (isInitialized && !token && !authRoutes.has(pathname)) {
    return null
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
