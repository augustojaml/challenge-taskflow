import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserAlreadyExistsError } from '@/shared/core/errors/user-already-exists-error'
import { RegisterUserUseCase } from '@/shared/domains/auth/use-cases/register-user-use-case'
import { passwordCrypto } from '@/shared/helpers'

import { userFaker } from '../fakes/user-fake'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let useRepo: InMemoryUserRepository
let sut: RegisterUserUseCase

describe('REGISTER AUTH USER USE CASE', () => {
  beforeEach(() => {
    useRepo = new InMemoryUserRepository()
    sut = new RegisterUserUseCase(useRepo)
  })

  it('Should be able to register auth user', async () => {
    const user = await userFaker()

    const userCreated = await sut.execute(user)

    expect(userCreated).toMatchObject({
      user: {
        id: expect.any(String),
        name: user.name,
        email: user.email,
      },
    })
  })

  it('Should not be able to register auth user with same email', async () => {
    const user = await userFaker()
    await sut.execute(user)
    await expect(() => sut.execute(user)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('should be able to hash user password', async () => {
    const user = await userFaker()

    const hashSpy = vi
      .spyOn(passwordCrypto, 'hash')
      .mockResolvedValueOnce(
        '$2b$06$BVWqkX3MopidsSnTSkVceuuTIVSFqkg9ccUz/vnLbA53Mjc4YKA.O',
      )

    await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(hashSpy).toHaveBeenCalledTimes(1)
    expect(hashSpy).toHaveBeenCalledWith(user.password)
  })
})
