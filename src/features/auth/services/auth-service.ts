import { api } from '@/shared/libs'

import { LoginUserParamsDto } from '../dtos/login-user-dto'
import { RegisterUserParamsDto } from '../dtos/register-user-dto'

const authService = {
  register: async (userData: RegisterUserParamsDto) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  login: async (userData: LoginUserParamsDto) => {
    const response = await api.post('/auth/login', userData)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

export { authService }
