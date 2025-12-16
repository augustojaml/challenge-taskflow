import {
  TaskEntity,
  TaskEntityProps,
} from '@/shared/domains/task/domain/entities/task.entity'

export type PrismaTaskResponse = TaskEntityProps & { id: string }

const prismaTaskMapper = {
  toPrisma: (domain: TaskEntity): PrismaTaskResponse => {
    return {
      id: domain.id,
      userId: domain.userId,
      title: domain.title,
      description: domain.description,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
  toDomain: (prisma: PrismaTaskResponse): TaskEntity => {
    return TaskEntity.create(
      {
        userId: prisma.userId,
        title: prisma.title,
        description: prisma.description,
        status: prisma.status,
        createdAt: prisma.createdAt,
        updatedAt: prisma.updatedAt,
      },
      prisma.id,
    )
  },
}

export { prismaTaskMapper }
