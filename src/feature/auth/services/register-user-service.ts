import { UserEntity } from '@/shared/domain/auth/domain/entities/user.entity'
import { AuthUserRepositoryPort } from '@/shared/domain/auth/domain/repositories/user-repository-port'
import { ResourceAlreadyExistsError } from '@/shared/domain/errors/resource-already-exists-error'
import { passwordCrypto } from '@/shared/helpers/password'

import {
  RegisterUserParamsDto,
  RegisterUserResponseDto,
  toRegisterUserResponseDto,
} from '../dtos/register-user.dto'

class RegisterUserService {
  constructor(private userRepository: AuthUserRepositoryPort) {}

  async execute(data: RegisterUserParamsDto): Promise<RegisterUserResponseDto> {
    const user = await this.userRepository.findByEmail(data.email)

    if (user) {
      throw new ResourceAlreadyExistsError()
    }

    const hashedPassword = await passwordCrypto.hash(data.password)

    const userEntity = UserEntity.create({
      ...data,
      passwordHash: hashedPassword,
    })

    const userRepo = await this.userRepository.create(userEntity)

    return toRegisterUserResponseDto(userRepo)
  }
}

export { RegisterUserService }
