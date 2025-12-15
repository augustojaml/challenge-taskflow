import { UserEntity } from '@/shared/domains/auth/domain/entities/user.entity'
import { AuthUserRepositoryPort } from '@/shared/domains/auth/domain/repositories/user-repository-port'

import { prisma } from '..'
import { prismaUserMapper } from '../mappers/user-mapper'

class PrismaUserRepositoryAdapter implements AuthUserRepositoryPort {
  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await prisma.user.create({
      data: prismaUserMapper.toPrisma(user),
    })

    return prismaUserMapper.toDomain(createdUser)
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!foundUser) {
      return null
    }

    return prismaUserMapper.toDomain(foundUser)
  }
  async findById(id: string): Promise<UserEntity | null> {
    const foundUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!foundUser) {
      return null
    }

    return prismaUserMapper.toDomain(foundUser)
  }
}

export { PrismaUserRepositoryAdapter }
