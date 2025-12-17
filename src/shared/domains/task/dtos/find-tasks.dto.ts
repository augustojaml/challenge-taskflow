import { TaskStatus } from '@/shared/core/types/task-status'

import { TaskEntity } from '../domain/entities/task.entity'

type FindTasksParamsDto = {
  userId: string
}

type FindTaskPaginationDto = {
  userId: string
  page?: number
  size?: number
  title?: string
  status?: TaskStatus
}

const toFindTasksResponseDto = (tasks: TaskEntity[]) => {
  return {
    tasks: tasks.map((task) => ({
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
  }
}

type FindTasksPaginationInput = {
  items: TaskEntity[]
  total: number
  page: number
  size: number
}

const toFindTasksResponsePaginationResponseDto = ({
  items,
  total,
  page,
  size,
}: FindTasksPaginationInput) => {
  return {
    result: {
      items: items.map((task) => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      total,
      page,
      size,
    },
  }
}
type FindTasksResponseDto = ReturnType<typeof toFindTasksResponseDto>

type FindTasksResponsePaginationResponseDto = ReturnType<
  typeof toFindTasksResponsePaginationResponseDto
>

export {
  type FindTaskPaginationDto,
  type FindTasksParamsDto,
  type FindTasksResponseDto,
  type FindTasksResponsePaginationResponseDto,
  toFindTasksResponseDto,
  toFindTasksResponsePaginationResponseDto,
}
