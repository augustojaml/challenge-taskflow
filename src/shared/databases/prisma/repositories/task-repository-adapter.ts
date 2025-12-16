import { TaskEntity } from '@/shared/domains/task/domain/entities/task.entity'
import { TaskRepositoryPort } from '@/shared/domains/task/domain/repositories/task-repository-port'

import { prisma } from '..'
import { prismaTaskMapper } from '../mappers/task-mapper'

class PrismaTaskRepositoryAdapter implements TaskRepositoryPort {
  async create(task: TaskEntity): Promise<TaskEntity> {
    const createdTask = await prisma.task.create({
      data: prismaTaskMapper.toPrisma(task),
    })

    return prismaTaskMapper.toDomain(createdTask)
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const foundTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!foundTask) {
      return null
    }

    return prismaTaskMapper.toDomain(foundTask)
  }

  async findByUserId(userId: string): Promise<TaskEntity[]> {
    const foundTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return foundTasks.map(prismaTaskMapper.toDomain)
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: prismaTaskMapper.toPrisma(task),
    })

    return prismaTaskMapper.toDomain(updatedTask)
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    })
  }
}

export { PrismaTaskRepositoryAdapter }
