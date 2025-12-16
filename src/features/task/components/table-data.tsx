'use client'

import { Eye, Trash2 } from 'lucide-react'

import { Badge } from '@/shared/components/shadcn/badge'
import { Button } from '@/shared/components/shadcn/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/shadcn/table'
import { Task } from '@/shared/core/types/task'
import { formatTimeBR } from '@/shared/helpers/format'

import { TableEmpty } from './table-empty'
import { TablePagination } from './table-pagination'
import { TasksTableSkeleton } from './table-skeleton'

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

const statusLabel: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
}

const statusVariant: Record<TaskStatus, 'default' | 'secondary' | 'outline'> = {
  PENDING: 'outline',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
}

interface TableDataProps {
  onDelete?: (task: Task) => void
  onSelect?: (task: Task) => void
  onOpenCreate?: () => void
  isLoading?: boolean
  data?: Task[]
}

const TableData = ({
  onDelete,
  onSelect,
  onOpenCreate,
  isLoading,
  data,
}: TableDataProps) => {
  const handleDelete = (task: Task) => {
    onDelete?.(task)
  }

  const handleSelect = (task: Task) => {
    onSelect?.(task)
  }

  return (
    <>
      <div className="bg-card rounded-lg border">
        {isLoading ? (
          <TasksTableSkeleton />
        ) : (
          <>
            {data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Atualizada em</TableHead>
                    <TableHead className="w-22.5 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.map((task) => (
                    <TableRow
                      key={task.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {task.description ?? '—'}
                      </TableCell>

                      <TableCell>
                        <Badge variant={statusVariant[task.status]}>
                          {statusLabel[task.status]}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {formatTimeBR(task.createdAt, {
                          timeStyle: 'short',
                        })}{' '}
                      </TableCell>
                      <TableCell>
                        {formatTimeBR(task.updatedAt, { timeStyle: 'short' })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSelect(task)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(task)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <TableEmpty onCreate={onOpenCreate} />
            )}
          </>
        )}
      </div>
      {data && data.length > 0 && <TablePagination />}
    </>
  )
}

export { TableData }
