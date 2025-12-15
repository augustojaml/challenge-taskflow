import { AuthUserRepositoryPort } from '@/shared/domain/auth/domain/repositories/user-repository-port'
import { UnauthorizedError } from '@/shared/domain/errors/unauthorized-error'
import { passwordCrypto } from '@/shared/helpers/password'

import {
  LoginUserParamsDto,
  LoginUserResponseDto,
  toLoginUserResponseDto,
} from '../dtos/login-user.dto'

class LoginUserService {
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
export { LoginUserService }
