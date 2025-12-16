import { TaskStatus } from '@/shared/core/types/task-status'

interface CreateTaskParamsDto {
  title: string
  description: string
  status: TaskStatus
}

interface CreateTaskResponseDto {
  task: {
    id: string
    title: string
    description: string
    dueDate: string
    createdAt: string
    updatedAt: string
  }
}

export { type CreateTaskParamsDto, type CreateTaskResponseDto }
