'use client'

import { useState } from 'react'

import { CreateTaskModal } from '@/features/task/components/create-task-modal'

import { DeleteTaskModal } from '../components/delete-task-modal'
import { TableData } from '../components/table-data'
import { TableEmpty } from '../components/table-empty'
import { TablePagination } from '../components/table-pagination'
import { TaskHeader } from '../components/task-header'

const TaskScreen = () => {
  const hasData = true
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)

  return (
    <div className="w-full py-6">
      <TaskHeader hasData={hasData} />
      {hasData && (
        <div>
          <TableData
            onDelete={() => setOpenModalDelete(true)}
            onNavigate={() => setOpenModalCreate(true)}
          />
          <TablePagination />
        </div>
      )}
      {!hasData && <TableEmpty onCreate={() => setOpenModalCreate(true)} />}

      <CreateTaskModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSubmit={async (data) => {
          console.log(data)
          // chamar mutation aqui
        }}
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
