import { TaskStatus } from '@/shared/core/types/task-status'

interface UpdateTaskParamsDto {
  id: string
  title: string
  description: string
  status: TaskStatus
}

export { type UpdateTaskParamsDto }
