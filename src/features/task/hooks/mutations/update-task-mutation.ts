import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { useToast } from '@/shared/providers/toast-provider'

import { UpdateTaskParamsDto } from '../../dtos/update-task-dto'
import { TaskService } from '../../services/task-service'

const useUpdateMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  return useMutation({
    mutationFn: async (data: UpdateTaskParamsDto) => {
      const task = await TaskService.update(data.id, data)
      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FIND_TASKS] })
      showToast({
        type: 'success',
        title: 'Tarefa atualizada com sucesso! 🎉',
        message: 'A tarefa foi atualizada na lista',
        position: 'top-right',
        duration: 5000,
      })
    },
    onError: () => {
      showToast({
        type: 'error',
        title: 'Ocorreu um erro ao atualizar a tarefa',
        message: 'Por favor, tente novamente',
        position: 'top-right',
        duration: 5000,
      })
    },
  })
}

export { useUpdateMutation }
