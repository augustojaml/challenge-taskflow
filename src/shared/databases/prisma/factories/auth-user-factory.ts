import { GetMeUseCase } from '@/shared/domains/auth/use-cases/get-me-use-case'
import { LoginUserUseCase } from '@/shared/domains/auth/use-cases/login-user-use-case'
import { RegisterUserUseCase } from '@/shared/domains/auth/use-cases/register-user-use-case'

import { PrismaUserRepositoryAdapter } from '../repositories/user-repository-adapter'

const userRepo = new PrismaUserRepositoryAdapter()

const authUserFactory = {
  registerUser: () => new RegisterUserUseCase(userRepo),
  loginUser: () => new LoginUserUseCase(userRepo),
  getMe: () => new GetMeUseCase(userRepo),
}

export { authUserFactory }
