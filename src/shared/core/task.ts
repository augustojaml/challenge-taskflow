import type { TaskStatus } from './task-status'
import type { User } from './user'

type TaskUser = Omit<User, 'passwordHash'>

type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: Date
  userId: string
  user: TaskUser | null
  createdAt: Date
  updatedAt: Date
}

export { type Task }
