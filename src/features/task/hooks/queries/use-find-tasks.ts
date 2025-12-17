import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/shared/constants/query-keys'

import { FindAllTasksParamsDto } from '../../dtos/find-all-task-dto'
import { TaskService } from '../../services/task-service'

export const useGetTasks = ({
  page = 1,
  size = 5,
  title,
  status,
}: FindAllTasksParamsDto) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FIND_TASKS, page, size, title, status],
    queryFn: async () => {
      const result = await TaskService.findAll({ page, size, title, status })

      return result
    },
    retry: false,
  })

  return query
}
