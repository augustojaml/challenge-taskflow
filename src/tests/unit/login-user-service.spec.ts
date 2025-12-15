import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginUserService } from '@/feature/auth/services/login-user-service'
import { UnauthorizedError } from '@/shared/domain/errors/unauthorized-error'
import { passwordCrypto } from '@/shared/helpers/password'

import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let useRepo: InMemoryUserRepository
let sut: LoginUserService

describe('LOGIN AUTH USER USE CASE', () => {
  beforeEach(() => {
    useRepo = new InMemoryUserRepository()
    sut = new LoginUserService(useRepo)
  })

  it('Should be able to login auth user', async () => {
    const user = await userFakeRepo({ repo: useRepo, password: '123456' })
    const login = await sut.execute({
      email: user.email,
      password: '123456',
    })

    expect(login).toMatchObject({
      user: {
        id: expect.any(String),
      },
    })
  })

  it('Should not be able to login auth with inexistent user', async () => {
    await userFakeRepo({ repo: useRepo })
    await expect(() =>
      sut.execute({ password: '123456', email: 'inexistent-email' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Should not be able to login auth with wrong password', async () => {
    const user = await userFakeRepo({ repo: useRepo })
    await expect(() =>
      sut.execute({ password: 'wrong-password', email: user.email }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to hash user password', async () => {
    const user = await userFakeRepo({ repo: useRepo })

    const compareSpy = vi
      .spyOn(passwordCrypto, 'verify')
      .mockResolvedValueOnce(true)

    await sut.execute({
      email: user.email,
      password: '123456',
    })

    expect(compareSpy).toHaveBeenCalledTimes(1)
    expect(compareSpy).toHaveBeenCalledWith('123456', user.passwordHash)
  })
})
