import { TaskStatus } from '@/shared/core/types/task-status'

import type { TaskEntity } from '../entities/task.entity'

interface TaskRepositoryPort {
  create(task: TaskEntity): Promise<TaskEntity>
  findById(id: string): Promise<TaskEntity | null>
  findByUserId(userId: string): Promise<TaskEntity[]>
  findByUserIdPaginated(props: {
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
  }>
  update(task: TaskEntity): Promise<TaskEntity>
  delete(id: string): Promise<void>
}

export { type TaskRepositoryPort }
