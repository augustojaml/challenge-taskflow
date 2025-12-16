import { useMutation } from '@tanstack/react-query'

import { authService } from '../../services/auth-service'

const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const user = await authService.logout()
      return user
    },
  })
}

export { useLogoutMutation }
