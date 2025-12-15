import { Entity } from '@/shared/core/entity'
import { OptionalType } from '@/shared/core/optional'

type UserEntityProps = {
  name: string
  email: string
  passwordHash: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

class UserEntity extends Entity<UserEntityProps> {
  private constructor(props: UserEntityProps, id?: string) {
    super(props, id)
  }

  static create(
    props: OptionalType<
      UserEntityProps,
      'passwordHash' | 'avatarUrl' | 'createdAt' | 'updatedAt'
    >,
    id?: string,
  ) {
    return new UserEntity(
      {
        ...props,
        passwordHash: props.passwordHash ?? null,
        avatarUrl: props.avatarUrl ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash ?? null
  }

  set passwordHash(passwordHash: string | null) {
    this.props.passwordHash = passwordHash
  }

  get avatarUrl() {
    return this.props.avatarUrl
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}

export { UserEntity, type UserEntityProps }
