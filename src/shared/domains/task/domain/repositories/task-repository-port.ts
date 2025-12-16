import type { TaskEntity } from '../entities/task.entity'

interface TaskRepositoryPort {
  create(task: TaskEntity): Promise<TaskEntity>
  findById(id: string): Promise<TaskEntity | null>
  findByUserId(userId: string): Promise<TaskEntity[]>
}

export { type TaskRepositoryPort }
