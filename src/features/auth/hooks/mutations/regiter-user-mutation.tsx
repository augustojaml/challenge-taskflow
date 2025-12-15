import { useMutation } from '@tanstack/react-query'

import { RegisterUserParamsDto } from '../../dtos/register-user-dto'
import { authService } from '../../services/auth-service'

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (serviceData: RegisterUserParamsDto) => {
      const user = await authService.register(serviceData)
      return user
    },
  })
}

export { useRegisterMutation }
