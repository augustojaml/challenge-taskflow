import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../../auth/domain/repositories/user-repository-port'
import { TaskEntity } from '../domain/entities/task.entity'
import { TaskRepositoryPort } from '../domain/repositories/task-repository-port'
import {
  CreateTaskParamsDto,
  CreateTaskResponseDto,
  toCreateTaskResponseDto,
} from '../dtos/create-task.dto'

class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: AuthUserRepositoryPort,
  ) {}

  async execute(data: CreateTaskParamsDto): Promise<CreateTaskResponseDto> {
    const user = await this.userRepository.findById(data.userId)

    if (!user) {
      throw new UnauthorizedError()
    }
    console.log(data)

    const taskEntity = TaskEntity.create({
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'PENDING',
    })

    const createdTask = await this.taskRepository.create(taskEntity)

    return toCreateTaskResponseDto(createdTask)
  }
}

export { CreateTaskUseCase }
