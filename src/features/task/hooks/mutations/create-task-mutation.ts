import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/shared/constants/query-keys'

import { CreateTaskParamsDto } from '../../dtos/create-task-dto'
import { TaskService } from '../../services/task-service'

const useCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateTaskParamsDto) => {
      const task = await TaskService.create(data)
      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FIND_TASKS] })
    },
  })
}

export { useCreateMutation }
