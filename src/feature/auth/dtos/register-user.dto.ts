import { User } from '@/shared/core/user'
import { UserEntity } from '@/shared/domain/auth/domain/entities/user.entity'

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
