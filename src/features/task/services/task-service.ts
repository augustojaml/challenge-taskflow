import { api } from '@/shared/libs'

import {
  CreateTaskParamsDto,
  CreateTaskResponseDto,
} from '../dtos/create-task-dto'

const TaskService = {
  findAll: async () => {
    const response = await api.get('/tasks')
    return response.data
  },
  create: async (data: CreateTaskParamsDto): Promise<CreateTaskResponseDto> => {
    const response = await api.post('/tasks', data)
    return response.data
  },
}

export { TaskService }
