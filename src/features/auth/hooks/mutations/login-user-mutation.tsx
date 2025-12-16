import { useMutation } from '@tanstack/react-query'

import { LoginUserParamsDto } from '../../dtos/login-user-dto'
import { authService } from '../../services/auth-service'

const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (serviceData: LoginUserParamsDto) => {
      const user = await authService.login(serviceData)
      return user
    },
  })
}

export { useLoginMutation }



