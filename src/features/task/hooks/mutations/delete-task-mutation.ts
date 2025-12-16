import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { useToast } from '@/shared/providers/toast-provider'

import { TaskService } from '../../services/task-service'

const useDeleteMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = await TaskService.delete(taskId)
      return task
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Tarefa deletada com sucesso! 🎉',
        message: 'A tarefa foi removida da sua lista',
        position: 'top-right',
        duration: 5000,
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FIND_TASKS] })
    },
    onError: () => {
      showToast({
        type: 'error',
        title: 'Ocorreu um erro ao deletar a tarefa',
        message: 'Por favor, tente novamente',
        position: 'top-right',
        duration: 5000,
      })
    },
  })
}

export { useDeleteMutation }
