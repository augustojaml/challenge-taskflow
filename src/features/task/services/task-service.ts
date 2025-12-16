import { Task } from '@/shared/core/types/task'
import { api } from '@/shared/libs'

import {
  CreateTaskParamsDto,
  CreateTaskResponseDto,
} from '../dtos/create-task-dto'

const TaskService = {
  findAll: async (): Promise<{ tasks: Task[] }> => {
    const response = await api.get('/tasks')
    return response.data
  },
  create: async (data: CreateTaskParamsDto): Promise<CreateTaskResponseDto> => {
    const response = await api.post('/tasks', data)
    return response.data
  },
  getById: async (id: string): Promise<{ task: Task }> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },
}

export { TaskService }
