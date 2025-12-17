import { beforeEach, describe, expect, it } from 'vitest'

import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { FindTasksUseCase } from '@/shared/domains/task/use-cases/find-tasks-use-case'

import { taskFakeRepo } from '../fakes/task-fake'
import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryTaskRepository } from '../in-memory/in-memory-task-repository'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let userRepo: InMemoryUserRepository
let taskRepo: InMemoryTaskRepository
let sut: FindTasksUseCase

describe('FIND TASKS USE CASE', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    taskRepo = new InMemoryTaskRepository()
    sut = new FindTasksUseCase(taskRepo, userRepo)
  })

  it('Should be able to find all tasks for a user', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })

    // Create multiple tasks for the user
    const task1 = await taskFakeRepo({ repo: taskRepo, userId: user.id })
    const task2 = await taskFakeRepo({ repo: taskRepo, userId: user.id })
    const task3 = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const { result } = await sut.execute({
      userId: user.id,
    })

    expect(result.items).toHaveLength(3)

    expect(result).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: task1.id,
          userId: user.id,
          title: task1.title,
          description: task1.description,
          status: task1.status,
        }),
        expect.objectContaining({
          id: task2.id,
          userId: user.id,
          title: task2.title,
          description: task2.description,
          status: task2.status,
        }),
        expect.objectContaining({
          id: task3.id,
          userId: user.id,
          title: task3.title,
          description: task3.description,
          status: task3.status,
        }),
      ]),
      total: 3,
      page: 1,
      size: 5,
    })
  })

  it('Should not be able to find tasks with inexistent user', async () => {
    await userFakeRepo({ repo: userRepo, password: '123456' })

    await expect(() =>
      sut.execute({
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
