import { TaskStatus } from '@/shared/core/types/task-status'

import { TaskEntity } from '../domain/entities/task.entity'

type CreateTaskParamsDto = {
  userId: string
  title: string
  description?: string | null
  status?: TaskStatus
}

const toCreateTaskResponseDto = (task: TaskEntity) => {
  return {
    task: {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    },
  }
}

type CreateTaskResponseDto = ReturnType<typeof toCreateTaskResponseDto>

export {
  type CreateTaskParamsDto,
  type CreateTaskResponseDto,
  toCreateTaskResponseDto,
}
