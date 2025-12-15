import { RegisterUserUseCase } from '@/shared/domains/auth/use-cases/register-user-use-case'

import { PrismaUserRepositoryAdapter } from '../repositories/user-repository-adapter'

const userRepo = new PrismaUserRepositoryAdapter()

const authUserFactory = {
  registerUser: () => new RegisterUserUseCase(userRepo),
}

export { authUserFactory }
