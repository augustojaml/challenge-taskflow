'use client'

import { useEffect, useState } from 'react'

import { CreateTaskModal } from '@/features/task/components/create-task-modal'
import { Task } from '@/shared/core/types/task'
import { TaskStatus } from '@/shared/core/types/task-status'

import { DeleteTaskModal } from '../components/delete-task-modal'
import { TableData } from '../components/table-data'
import { TaskHeader } from '../components/task-header'
import { useDeleteMutation } from '../hooks/mutations/delete-task-mutation'
import { useGetTasks } from '../hooks/queries/use-find-tasks'

export interface DefaultTask {
  id: string
  title: string
  description: string
  status: TaskStatus
}

const DEFAULT_TASK_VALUE: DefaultTask = {
  id: '',
  title: '',
  description: '',
  status: 'PENDING',
}

const TaskScreen = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [defaultTask, setDefaultTask] =
    useState<DefaultTask>(DEFAULT_TASK_VALUE)

  const [page, setPage] = useState(1)
  const [size, setSize] = useState(5)

  const { data: result, isLoading: isTasksLoading } = useGetTasks({
    page: page,
    size: size,
  })
  const deleteTask = useDeleteMutation()

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setOpenModalCreate(true)
  }

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task)
    setOpenModalDelete(true)
  }

  useEffect(() => {
    if (selectedTask) {
      setDefaultTask({
        id: selectedTask.id,
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
      })
    } else {
      setDefaultTask(DEFAULT_TASK_VALUE)
    }
  }, [selectedTask])

  return (
    <div className="w-full py-6">
      <TaskHeader
        hasData={!!result?.items && result?.items.length > 0}
        onOpen={() => {
          setSelectedTask(undefined)
          setOpenModalCreate(true)
        }}
      />

      <TableData
        onDelete={handleDeleteTask}
        onSelect={handleSelectTask}
        onOpenCreate={() => setOpenModalCreate(true)}
        onPageChange={(newPage) => setPage(newPage)}
        onSizeChange={(newSize) => {
          setPage(1)
          setSize(newSize)
        }}
        isLoading={isTasksLoading}
        data={result?.items || []}
        total={result?.total || 0}
        page={result?.page || 1}
        size={result?.size || 5}
      />

      <CreateTaskModal
        open={openModalCreate}
        onClose={() => {
          setOpenModalCreate(false)
          setSelectedTask(undefined)
        }}
        defaultValues={defaultTask}
      />

      <DeleteTaskModal
        open={openModalDelete}
        onClose={() => {
          setOpenModalDelete(false)
          setSelectedTask(undefined)
        }}
        task={selectedTask || undefined}
        isDeleting={deleteTask.isPending}
        onConfirm={() => deleteTask.mutateAsync(selectedTask?.id || '')}
      />
    </div>
  )
}

export { TaskScreen }
