import { User } from '@/shared/core/types/user'

interface RegisterUserParamsDto {
  name: string
  email: string
  password: string
}

interface RegisterUserResponseDto {
  message: string
  user: Pick<User, 'id' | 'name' | 'email'>
}

export { type RegisterUserParamsDto, type RegisterUserResponseDto }
