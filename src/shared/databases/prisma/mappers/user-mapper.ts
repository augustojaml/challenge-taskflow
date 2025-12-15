import {
  UserEntity,
  UserEntityProps,
} from '@/shared/domains/auth/domain/entities/user.entity'

export type PrismaUserResponse = UserEntityProps & { id: string }

const prismaUserMapper = {
  toPrisma: (domain: UserEntity): PrismaUserResponse => {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      passwordHash: domain.passwordHash,
      avatarUrl: domain.avatarUrl,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  },
  toDomain: (prisma: PrismaUserResponse): UserEntity => {
    return UserEntity.create(
      {
        name: prisma.name,
        email: prisma.email,
        passwordHash: prisma.passwordHash,
        avatarUrl: prisma.avatarUrl,
        createdAt: prisma.createdAt,
        updatedAt: prisma.updatedAt,
      },
      prisma.id,
    )
  },
}

export { prismaUserMapper }
