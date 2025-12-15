import { UserEntity } from '@/shared/core/auth/domain/entities/user.entity'
import { AuthUserRepositoryPort } from '@/shared/core/auth/domain/repositories/user-repository-port'

class InMemoryUserRepository implements AuthUserRepositoryPort {
  public users: UserEntity[] = []
  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user)
    return Promise.resolve(user)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.email === email)
    return Promise.resolve(user ?? null)
  }

  findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.id === id)
    return Promise.resolve(user ?? null)
  }
}

export { InMemoryUserRepository }
