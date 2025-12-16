import { ResourceNotFoundError } from '@/shared/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../../auth/domain/repositories/user-repository-port'
import { TaskRepositoryPort } from '../domain/repositories/task-repository-port'
import {
  toUpdateTaskResponseDto,
  UpdateTaskParamsDto,
  UpdateTaskResponseDto,
} from '../dtos/update-task.dto'

class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: AuthUserRepositoryPort,
  ) {}

  async execute(data: UpdateTaskParamsDto): Promise<UpdateTaskResponseDto> {
    const user = await this.userRepository.findById(data.userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const task = await this.taskRepository.findById(data.id)

    if (!task) {
      throw new ResourceNotFoundError()
    }

    if (task.userId !== data.userId) {
      throw new UnauthorizedError()
    }

    if (data.title !== undefined) {
      task.title = data.title
    }

    if (data.description !== undefined) {
      task.description = data.description
    }

    if (data.status !== undefined) {
      task.status = data.status
    }

    const updatedTask = await this.taskRepository.update(task)

    return toUpdateTaskResponseDto(updatedTask)
  }
}

export { UpdateTaskUseCase }
