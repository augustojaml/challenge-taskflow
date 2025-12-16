import { CreateTaskUseCase } from '@/shared/domains/task/use-cases/create-task-use-case'
import { DeleteTaskUseCase } from '@/shared/domains/task/use-cases/delete-task-use-case'
import { FindTasksUseCase } from '@/shared/domains/task/use-cases/find-tasks-use-case'
import { UpdateTaskUseCase } from '@/shared/domains/task/use-cases/update-task-use-case'

import { PrismaTaskRepositoryAdapter } from '../repositories/task-repository-adapter'
import { PrismaUserRepositoryAdapter } from '../repositories/user-repository-adapter'

const taskRepo = new PrismaTaskRepositoryAdapter()
const userRepo = new PrismaUserRepositoryAdapter()

const taskFactory = {
  createTask: () => new CreateTaskUseCase(taskRepo, userRepo),
  findTasks: () => new FindTasksUseCase(taskRepo, userRepo),
  updateTask: () => new UpdateTaskUseCase(taskRepo, userRepo),
  deleteTask: () => new DeleteTaskUseCase(taskRepo, userRepo),
}

export { taskFactory }
