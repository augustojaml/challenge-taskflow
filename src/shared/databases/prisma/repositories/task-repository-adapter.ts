import { TaskStatus } from '@/shared/core/types/task-status'
import { TaskEntity } from '@/shared/domains/task/domain/entities/task.entity'
import { TaskRepositoryPort } from '@/shared/domains/task/domain/repositories/task-repository-port'

import { prisma } from '..'
import { Prisma } from '../generated/client'
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

  async findByUserIdPaginated(props: {
    userId: string
    page?: number
    size?: number
    title?: string
    status?: TaskStatus
  }): Promise<{
    items: TaskEntity[]
    total: number
    page: number
    size: number
  }> {
    const page = Math.max(1, props.page ?? 1)
    const size = Math.max(1, props.size ?? 10)
    const skip = (page - 1) * size

    console.log(props.title)

    const where: Prisma.TaskWhereInput = {
      AND: [
        { userId: props.userId },
        props.title?.length
          ? {
              title: {
                contains: props.title,
              },
            }
          : {},
        props.status ? { status: props.status } : {},
      ],
    }

    const [total, rows] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
    ])

    return {
      items: rows.map(prismaTaskMapper.toDomain),
      total,
      page,
      size,
    }
  }
}

export { PrismaTaskRepositoryAdapter }
