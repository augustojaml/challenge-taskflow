import { useQuery } from '@tanstack/react-query'

import { authService } from '../../services/auth-service'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['get-me'],
    queryFn: async () => {
      const result = await authService.getMe()

      return result.user
    },
  })
}
