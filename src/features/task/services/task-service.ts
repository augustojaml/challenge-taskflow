import { Task } from '@/shared/core/types/task'
import { api } from '@/shared/libs'

import { CreateTaskParamsDto } from '../dtos/create-task-dto'
import {
  FindAllTasksParamsDto,
  FindAllTasksResponseDto,
} from '../dtos/find-all-task-dto'
import { UpdateTaskParamsDto } from '../dtos/update-task-dto'

const TaskService = {
  findAll: async ({
    page = 1,
    size = 5,
  }: FindAllTasksParamsDto): Promise<FindAllTasksResponseDto> => {
    const { data } = await api.get(`/tasks?page=${page}&size=${size}`)

    return data.result
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
