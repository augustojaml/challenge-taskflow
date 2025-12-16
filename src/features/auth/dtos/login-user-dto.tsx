import { User } from '@/shared/core/types/user'

interface LoginUserParamsDto {
  email: string
  password: string
}

interface LoginUserResponseDto {
  token: string
  user: Pick<User, 'id' | 'name' | 'email'>
}

export { type LoginUserParamsDto, type LoginUserResponseDto }
