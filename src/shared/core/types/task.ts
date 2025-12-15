import type { TaskPriority } from './task-priority'
import type { TaskStatus } from './task-status'
import type { User } from './user'

type TaskUser = Omit<User, 'passwordHash'>

type Task = {
  id: string
  title: string
  description: string
  dueDate: Date
  priority: TaskPriority
  status: TaskStatus
  creatorId: string
  creator: TaskUser | null
  createdAt: Date
  updatedAt: Date
}

export { type Task }
