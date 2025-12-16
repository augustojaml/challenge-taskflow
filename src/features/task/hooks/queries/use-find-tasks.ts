import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/shared/constants/query-keys'

import { TaskService } from '../../services/task-service'

export const useGetTasks = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FIND_TASKS],
    queryFn: async () => {
      const result = await TaskService.findAll()

      return result.tasks
    },
    retry: false,
  })

  return query
}
