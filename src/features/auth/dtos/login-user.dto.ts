import { User } from '@/shared/core/types/user'
import { UserEntity } from '@/shared/domains/auth/domain/entities/user.entity'

type LoginUserParamsDto = Pick<User, 'email'> & {
  password: string
}

const toLoginUserResponseDto = (user: UserEntity) => {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

type LoginUserResponseDto = ReturnType<typeof toLoginUserResponseDto>

export {
  type LoginUserParamsDto,
  type LoginUserResponseDto,
  toLoginUserResponseDto,
}
