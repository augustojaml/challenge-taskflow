import { TaskEntity } from '../domain/entities/task.entity'

type FindTasksParamsDto = {
  userId: string
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

type FindTasksResponseDto = ReturnType<typeof toFindTasksResponseDto>

export {
  type FindTasksParamsDto,
  type FindTasksResponseDto,
  toFindTasksResponseDto,
}
