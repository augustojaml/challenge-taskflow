import { TaskEntity } from '../domain/entities/task.entity'

type CreateTaskParamsDto = {
  userId: string
  title: string
  description?: string | null
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
