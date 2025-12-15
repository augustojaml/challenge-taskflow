import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { AuthUserRepositoryPort } from '@/shared/domains/auth/domain/repositories/user-repository-port'
import { passwordCrypto } from '@/shared/helpers'

import {
  LoginUserParamsDto,
  LoginUserResponseDto,
  toLoginUserResponseDto,
} from '../dtos/login-user.dto'

class LoginUserUseCase {
  constructor(private readonly _userRepository: AuthUserRepositoryPort) {}

  async execute(data: LoginUserParamsDto): Promise<LoginUserResponseDto> {
    const user = await this._userRepository.findByEmail(data.email)

    if (!user) {
      throw new UnauthorizedError()
    }

    const comparePassword = await passwordCrypto.verify(
      data.password,
      user.passwordHash as string,
    )

    if (!comparePassword) {
      throw new UnauthorizedError()
    }

    return toLoginUserResponseDto(user)
  }
}
export { LoginUserUseCase }
