import { beforeEach, describe, expect, it } from 'vitest'

import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { GetMeUseCase } from '@/shared/domains/auth/use-cases/get-me-use-case'

import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let useRepo: InMemoryUserRepository
let sut: GetMeUseCase

describe('GET ME USE CASE', () => {
  beforeEach(() => {
    useRepo = new InMemoryUserRepository()
    sut = new GetMeUseCase(useRepo)
  })

  it('Should be able to get auth user', async () => {
    const user = await userFakeRepo({ repo: useRepo, password: '123456' })
    const login = await sut.execute({
      userId: user.id,
    })

    expect(login).toMatchObject({
      user: {
        id: expect.any(String),
        name: user.name,
        email: user.email,
      },
    })
  })

  it('Should not be able to get auth user with inexistent user', async () => {
    await userFakeRepo({ repo: useRepo })
    await expect(() =>
      sut.execute({ userId: 'inexistent-user-id' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
