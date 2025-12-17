'use client'

import { Eye, Trash2 } from 'lucide-react'

import { BadgeStatus } from '@/shared/components/custom/badge-status'
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

interface TableDataProps {
  onDelete?: (task: Task) => void
  onSelect?: (task: Task) => void
  onOpenCreate?: () => void
  onPageChange?: (page: number) => void
  onSizeChange?: (size: number) => void
  isLoading?: boolean
  data?: Task[]
  total?: number
  page?: number
  size?: number
}

const TableData = ({
  onDelete,
  onSelect,
  onOpenCreate,
  onPageChange,
  onSizeChange,
  isLoading,
  data,
  total = 0,
  page = 1,
  size = 5,
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
                        <BadgeStatus status={task.status} />
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
      {data && data.length > 0 && (
        <TablePagination
          total={total}
          page={page || 1}
          size={size}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
        />
      )}
    </>
  )
}

export { TableData }
