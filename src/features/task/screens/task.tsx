'use client'

import { useState } from 'react'

import { CreateTaskModal } from '@/features/task/components/create-task-modal'

import { DeleteTaskModal } from '../components/delete-task-modal'
import { TableData } from '../components/table-data'
import { TaskHeader } from '../components/task-header'
import { useGetTasks } from '../hooks/queries/use-find-tasks'

const TaskScreen = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks()

  return (
    <div className="w-full py-6">
      <TaskHeader
        hasData={!!tasks && tasks.length > 0}
        onOpen={() => setOpenModalCreate(true)}
      />

      <TableData
        onDelete={() => setOpenModalDelete(true)}
        onNavigate={() => setOpenModalCreate(true)}
        isLoading={isTasksLoading}
        data={tasks || []}
        onOpenCreate={() => setOpenModalCreate(true)}
      />

      <CreateTaskModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
      />

      <DeleteTaskModal
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        taskTitle={'Task Example'}
        taskId={'task-id'}
        // isDeleting={deleteTaskMT.isPending}
        onConfirm={() => console.log('deleting...')}
      />
    </div>
  )
}

export { TaskScreen }
