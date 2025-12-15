import { faker } from '@faker-js/faker'

import { UserEntity } from '@/shared/domains/auth/domain/entities/user.entity'
import { AuthUserRepositoryPort } from '@/shared/domains/auth/domain/repositories/user-repository-port'
import { passwordCrypto } from '@/shared/helpers/password'

type UserFakeParams = {
  password?: string
}

const userFaker = async ({ password = '123456' }: UserFakeParams = {}) => {
  return {
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    email: faker.internet.email(),
    password,
  }
}

type UserFakeRepoParams = {
  password?: string
  repo: AuthUserRepositoryPort
}

const userFakeRepo = async ({
  password = '123456',
  repo,
}: UserFakeRepoParams) => {
  const user = await userFaker({
    password: await passwordCrypto.hash(password),
  })
  return repo.create(
    UserEntity.create({ ...user, passwordHash: user.password }),
  )
}

export { userFaker, userFakeRepo }
