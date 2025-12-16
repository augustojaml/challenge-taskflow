'use client'

import { useState } from 'react'

import { CreateTaskModal } from '@/features/task/components/create-task-modal'
import { Task } from '@/shared/core/types/task'

import { DeleteTaskModal } from '../components/delete-task-modal'
import { TableData } from '../components/table-data'
import { TaskHeader } from '../components/task-header'
import { useGetTasks } from '../hooks/queries/use-find-tasks'

const TaskScreen = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks()

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setOpenModalCreate(true)
  }

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task)
    setOpenModalDelete(true)
  }

  return (
    <div className="w-full py-6">
      <TaskHeader
        hasData={!!tasks && tasks.length > 0}
        onOpen={() => setOpenModalCreate(true)}
      />

      <TableData
        onDelete={handleDeleteTask}
        onSelect={handleSelectTask}
        isLoading={isTasksLoading}
        data={tasks || []}
        onOpenCreate={() => setOpenModalCreate(true)}
      />

      <CreateTaskModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        defaultValues={selectedTask}
      />

      <DeleteTaskModal
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        task={selectedTask || undefined}
        // isDeleting={deleteTaskMT.isPending}
        onConfirm={() => console.log('deleting...')}
      />
    </div>
  )
}

export { TaskScreen }
