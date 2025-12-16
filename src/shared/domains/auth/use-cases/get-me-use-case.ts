import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'

import { AuthUserRepositoryPort } from '../domain/repositories/user-repository-port'
import { GetMeParamsDto, toGetMeResponseDto } from '../dtos/get-me.dto'

class GetMeUseCase {
  constructor(private userRepository: AuthUserRepositoryPort) {}

  async execute({ userId }: GetMeParamsDto) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }
    return toGetMeResponseDto(user)
  }
}
export { GetMeUseCase }
