import { beforeEach, describe, expect, it } from 'vitest'

import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { CreateTaskUseCase } from '@/shared/domains/task/use-cases/create-task-use-case'

import { taskFakeRepo } from '../fakes/task-fake'
import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryTaskRepository } from '../in-memory/in-memory-task-repository'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let useRepo: InMemoryUserRepository
let taskRepo: InMemoryTaskRepository
let sut: CreateTaskUseCase

describe('CREATE TASK USE CASE', () => {
  beforeEach(() => {
    useRepo = new InMemoryUserRepository()
    taskRepo = new InMemoryTaskRepository()
    sut = new CreateTaskUseCase(taskRepo, useRepo)
  })

  it('Should be able to create a task', async () => {
    const user = await userFakeRepo({ repo: useRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })
    const result = await sut.execute({
      userId: user.id,
      title: task.title,
      description: task.description,
    })

    expect(result).toMatchObject({
      task: {
        id: expect.any(String),
        title: task.title,
        description: task.description,
        status: task.status,
      },
    })
  })

  it('Should not be able to create a task with inexistent user', async () => {
    await userFakeRepo({ repo: useRepo })
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user-id',
        title: 'Task 1',
        description: 'Task 1 description',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
