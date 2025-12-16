import { UserEntity } from '@/shared/domains/auth/domain/entities/user.entity'

type GetMeParamsDto = {
  userId: string
}

const toGetMeResponseDto = (user: UserEntity) => {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

type GetMeResponseDto = ReturnType<typeof toGetMeResponseDto>

export { type GetMeParamsDto, type GetMeResponseDto, toGetMeResponseDto }
