import { Entity } from '@/shared/core/abstracts/entity'
import { OptionalType } from '@/shared/core/types/optional'
import { TaskStatus } from '@/shared/databases/prisma/generated/enums'

type TaskEntityProps = {
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

class TaskEntity extends Entity<TaskEntityProps> {
  private constructor(props: TaskEntityProps, id?: string) {
    super(props, id)
  }

  static create(
    props: OptionalType<
      TaskEntityProps,
      'description' | 'status' | 'createdAt' | 'updatedAt'
    >,
    id?: string,
  ) {
    return new TaskEntity(
      {
        ...props,
        description: props.description ?? null,
        status: props.status ?? TaskStatus.PENDING,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }

  get userId() {
    return this.props.userId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.updatedAt = new Date()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null) {
    this.props.description = description
    this.props.updatedAt = new Date()
  }

  get status() {
    return this.props.status
  }

  set status(status: TaskStatus) {
    this.props.status = status
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}

export { TaskEntity, type TaskEntityProps }
