import type { TaskStatus } from './task-status'

type Task = {
  id: string
  title: string
  description: string
  dueDate: Date
  status: TaskStatus
  userId: string
  createdAt: Date
  updatedAt: Date
}

export { type Task }
