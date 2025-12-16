import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../../auth/domain/repositories/user-repository-port'
import { TaskRepositoryPort } from '../domain/repositories/task-repository-port'
import {
  FindTasksParamsDto,
  FindTasksResponseDto,
  toFindTasksResponseDto,
} from '../dtos/find-tasks.dto'

class FindTasksUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: AuthUserRepositoryPort,
  ) {}

  async execute(data: FindTasksParamsDto): Promise<FindTasksResponseDto> {
    const user = await this.userRepository.findById(data.userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const tasks = await this.taskRepository.findByUserId(data.userId)

    return toFindTasksResponseDto(tasks)
  }
}

export { FindTasksUseCase }
