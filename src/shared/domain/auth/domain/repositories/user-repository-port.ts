import type { UserEntity } from '../entities/user.entity'

interface AuthUserRepositoryPort {
  create(user: UserEntity): Promise<UserEntity>
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
}

export { type AuthUserRepositoryPort }
