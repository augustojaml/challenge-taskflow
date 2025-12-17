import { TaskStatus } from '@/shared/core/types/task-status'
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

  async findByUserIdPaginated(props: {
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
  }> {
    const page = Math.max(1, props.page ?? 1)
    const size = Math.max(1, props.size ?? 10)
    const offset = (page - 1) * size

    let filtered = this.tasks.filter((task) => task.userId === props.userId)

    if (props.title) {
      const search = props.title.toLowerCase()
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search),
      )
    }

    if (props.status) {
      filtered = filtered.filter((task) => task.status === props.status)
    }

    filtered = filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    const total = filtered.length

    const items = filtered.slice(offset, offset + size)

    return {
      items,
      total,
      page,
      size,
    }
  }
}

export { InMemoryTaskRepository }
