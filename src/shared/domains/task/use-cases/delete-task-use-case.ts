import { ResourceNotFoundError } from '@/shared/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../../auth/domain/repositories/user-repository-port'
import { TaskRepositoryPort } from '../domain/repositories/task-repository-port'
import {
  DeleteTaskParamsDto,
  DeleteTaskResponseDto,
  toDeleteTaskResponseDto,
} from '../dtos/delete-task.dto'

class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: AuthUserRepositoryPort,
  ) {}

  async execute(data: DeleteTaskParamsDto): Promise<DeleteTaskResponseDto> {
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

    await this.taskRepository.delete(data.id)

    return toDeleteTaskResponseDto()
  }
}

export { DeleteTaskUseCase }
