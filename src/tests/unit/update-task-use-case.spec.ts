import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/shared/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/shared/core/errors/unauthorized-error'
import { TaskStatus } from '@/shared/databases/prisma/generated/enums'
import { UpdateTaskUseCase } from '@/shared/domains/task/use-cases/update-task-use-case'

import { taskFakeRepo } from '../fakes/task-fake'
import { userFakeRepo } from '../fakes/user-fake'
import { InMemoryTaskRepository } from '../in-memory/in-memory-task-repository'
import { InMemoryUserRepository } from '../in-memory/in-memory-user-repository'

let userRepo: InMemoryUserRepository
let taskRepo: InMemoryTaskRepository
let sut: UpdateTaskUseCase

describe('UPDATE TASK USE CASE', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    taskRepo = new InMemoryTaskRepository()
    sut = new UpdateTaskUseCase(taskRepo, userRepo)
  })

  it('Should be able to update a task title', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
      title: 'Updated Title',
    })

    expect(result.task.title).toBe('Updated Title')
    expect(result.task.description).toBe(task.description)
    expect(result.task.status).toBe(task.status)
  })

  it('Should be able to update a task description', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
      description: 'Updated Description',
    })

    expect(result.task.title).toBe(task.title)
    expect(result.task.description).toBe('Updated Description')
    expect(result.task.status).toBe(task.status)
  })

  it('Should be able to update a task status', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
      status: TaskStatus.COMPLETED,
    })

    expect(result.task.title).toBe(task.title)
    expect(result.task.description).toBe(task.description)
    expect(result.task.status).toBe(TaskStatus.COMPLETED)
  })

  it('Should be able to update multiple fields at once', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
      title: 'New Title',
      description: 'New Description',
      status: TaskStatus.IN_PROGRESS,
    })

    expect(result.task.title).toBe('New Title')
    expect(result.task.description).toBe('New Description')
    expect(result.task.status).toBe(TaskStatus.IN_PROGRESS)
  })

  it('Should update the updatedAt timestamp', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    const originalUpdatedAt = task.updatedAt

    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10))

    const result = await sut.execute({
      id: task.id,
      userId: user.id,
      title: 'Updated Title',
    })

    expect(result.task.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    )
  })

  it('Should not be able to update a task with inexistent user', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user.id })

    await expect(() =>
      sut.execute({
        id: task.id,
        userId: 'inexistent-user-id',
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Should not be able to update a task that does not exist', async () => {
    const user = await userFakeRepo({ repo: userRepo, password: '123456' })

    await expect(() =>
      sut.execute({
        id: 'inexistent-task-id',
        userId: user.id,
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to update a task from another user', async () => {
    const user1 = await userFakeRepo({ repo: userRepo, password: '123456' })
    const user2 = await userFakeRepo({ repo: userRepo, password: '123456' })
    const task = await taskFakeRepo({ repo: taskRepo, userId: user1.id })

    await expect(() =>
      sut.execute({
        id: task.id,
        userId: user2.id,
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
