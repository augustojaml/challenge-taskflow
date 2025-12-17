import { Task } from '@/shared/core/types/task'
import { TaskStatus } from '@/shared/core/types/task-status'

interface FindAllTasksParamsDto {
  page?: number
  size?: number
  title?: string
  status?: TaskStatus
}

interface FindAllTasksResponseDto {
  items: Task[]
  total: number
  page: number
  size: number
}

export { type FindAllTasksParamsDto, type FindAllTasksResponseDto }
