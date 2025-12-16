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

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status
  }

  set status(status: TaskStatus) {
    this.props.status = status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}

export { TaskEntity, type TaskEntityProps }

