import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/shared/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { DeleteTaskUseCase } from '@/shared/domains/task/use-cases/delete-task-use-case'

import { taskFakeRepo } from '../fakes/task-fake'
import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryTaskRepository } from '../in-memory/in-memory-task-repository'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let userRepo: InMemoryUserRepository
let taskRepo: InMemoryTaskRepository
let sut: DeleteTaskUseCase

describe('DELETE TASK USE CASE', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    taskRepo = new InMemoryTaskRepository()
    sut = new DeleteTaskUseCase(taskRepo, userRepo)
  })

  it('Should be able to delete a task', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
    })

    expect(result.message).toBe('Task deleted successfully')

    const deletedTask = await taskRepo.findById(task.id)
    expect(deletedTask).toBeNull()
  })

  it('Should not be able to delete a task with inexistent user', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    await expect(() =>
      sut.execute({
        id: task.id,
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Should not be able to delete a task that does not exist', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })

    await expect(() =>
      sut.execute({
        id: 'inexistent-task-id',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
