'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { LocalStorage } from '@/shared/helpers'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = LocalStorage.get<string>(TOKEN_KEY)
    const savedUser = LocalStorage.get<User>(USER_KEY)

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    LocalStorage.set(TOKEN_KEY, newToken)
    LocalStorage.set(USER_KEY, newUser)
    // Salvar token em cookie para o middleware
    if (typeof document !== 'undefined') {
      document.cookie = `auth_token=${newToken}; path=/; max-age=604800; SameSite=Lax`
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    LocalStorage.remove(TOKEN_KEY)
    LocalStorage.remove(USER_KEY)
    // Remover cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
    }
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
