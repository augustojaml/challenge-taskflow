import { api } from '@/shared/libs'

import { RegisterUserParamsDto } from '../dtos/register-user-dto'

const authService = {
  register: async (userData: RegisterUserParamsDto) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
}

export { authService }
