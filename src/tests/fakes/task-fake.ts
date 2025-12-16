import { faker } from '@faker-js/faker'

import { TaskStatus } from '@/shared/databases/prisma/generated/enums'
import { TaskEntity } from '@/shared/domains/task/domain/entities/task.entity'
import { TaskRepositoryPort } from '@/shared/domains/task/domain/repositories/task-repository-port'

type TaskFakeParams = {
  userId: string
  status?: TaskStatus
}

const taskFaker = ({ userId, status = TaskStatus.PENDING }: TaskFakeParams) => {
  return {
    userId,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status,
  }
}

type TaskFakeRepoParams = TaskFakeParams & {
  repo: TaskRepositoryPort
}

const taskFakeRepo = async ({ repo, ...params }: TaskFakeRepoParams) => {
  const taskData = taskFaker(params)

  const taskEntity = TaskEntity.create({
    userId: taskData.userId,
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
  })

  return repo.create(taskEntity)
}

export { taskFaker, taskFakeRepo }
