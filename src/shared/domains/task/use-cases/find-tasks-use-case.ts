import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../../auth/domain/repositories/user-repository-port'
import { TaskRepositoryPort } from '../domain/repositories/task-repository-port'
import {
  FindTaskPaginationDto,
  FindTasksResponsePaginationResponseDto,
  toFindTasksResponsePaginationResponseDto,
} from '../dtos/find-tasks.dto'

class FindTasksUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: AuthUserRepositoryPort,
  ) {}

  async execute(
    data: FindTaskPaginationDto,
  ): Promise<FindTasksResponsePaginationResponseDto> {
    const user = await this.userRepository.findById(data.userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const result = await this.taskRepository.findByUserIdPaginated({
      userId: data.userId,
      page: data.page || 1,
      size: data.size || 5,
      title: data.title,
      status: data.status,
    })

    return toFindTasksResponsePaginationResponseDto(result)
  }
}

export { FindTasksUseCase }
