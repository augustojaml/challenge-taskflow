import { TaskEntity } from '@/shared/domains/task/domain/entities/task.entity'
import { TaskRepositoryPort } from '@/shared/domains/task/domain/repositories/task-repository-port'

class InMemoryTaskRepository implements TaskRepositoryPort {
  public tasks: TaskEntity[] = []

  create(task: TaskEntity): Promise<TaskEntity> {
    this.tasks.push(task)
    return Promise.resolve(task)
  }

  findById(id: string): Promise<TaskEntity | null> {
    const task = this.tasks.find((t) => t.id === id)
    return Promise.resolve(task ?? null)
  }

  findByUserId(userId: string): Promise<TaskEntity[]> {
    const tasks = this.tasks.filter((t) => t.userId === userId)
    return Promise.resolve(tasks)
  }

  update(task: TaskEntity): Promise<TaskEntity> {
    const index = this.tasks.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      this.tasks[index] = task
    }
    return Promise.resolve(task)
  }

  delete(id: string): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.tasks.splice(index, 1)
    }
    return Promise.resolve()
  }
}

export { InMemoryTaskRepository }
