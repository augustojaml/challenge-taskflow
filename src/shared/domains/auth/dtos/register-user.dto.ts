import { User } from '@/shared/core/types/user'
import { UserEntity } from '@/shared/domains/auth/domain/entities/user.entity'

type RegisterUserParamsDto = Pick<User, 'name' | 'email'> & {
  password: string
}

const toRegisterUserResponseDto = (user: UserEntity) => {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

type RegisterUserResponseDto = ReturnType<typeof toRegisterUserResponseDto>

export {
  type RegisterUserParamsDto,
  type RegisterUserResponseDto,
  toRegisterUserResponseDto,
}
