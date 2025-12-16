import { TaskStatus } from '@/shared/databases/prisma/generated/enums'

import { TaskEntity } from '../domain/entities/task.entity'

type UpdateTaskParamsDto = {
  id: string
  userId: string
  title?: string
  description?: string | null
  status?: TaskStatus
}

const toUpdateTaskResponseDto = (task: TaskEntity) => {
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

type UpdateTaskResponseDto = ReturnType<typeof toUpdateTaskResponseDto>

export {
  toUpdateTaskResponseDto,
  type UpdateTaskParamsDto,
  type UpdateTaskResponseDto,
}
