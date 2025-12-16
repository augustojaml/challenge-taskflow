import { Task } from '@/shared/core/types/task'
import { api } from '@/shared/libs'

import { CreateTaskParamsDto } from '../dtos/create-task-dto'
import { UpdateTaskParamsDto } from '../dtos/update-task-dto'

const TaskService = {
  findAll: async (): Promise<{ tasks: Task[] }> => {
    const response = await api.get('/tasks')
    return response.data
  },
  create: async (data: CreateTaskParamsDto): Promise<{ task: Task }> => {
    const response = await api.post('/tasks', data)
    return response.data
  },
  update: async (
    id: string,
    data: UpdateTaskParamsDto,
  ): Promise<{ task: Task }> => {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

export { TaskService }
