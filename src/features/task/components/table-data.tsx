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

/* =========================
 * Tipos
 * ========================= */

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

type Task = {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

/* =========================
 * Dados fictícios (pt-BR)
 * ========================= */

const tasksMock: Task[] = [
  {
    id: '1',
    title: 'Criar layout da dashboard',
    description: 'Definir estrutura inicial da dashboard',
    status: 'COMPLETED',
    createdAt: '10/01/2025',
    updatedAt: '10/01/2025',
  },
  {
    id: '2',
    title: 'Implementar autenticação',
    description: 'Login e cadastro de usuários',
    status: 'IN_PROGRESS',
    createdAt: '08/01/2025',
    updatedAt: '12/01/2025',
  },
  {
    id: '3',
    title: 'Configurar banco de dados',
    description: 'Prisma + MySQL',
    status: 'COMPLETED',
    createdAt: '05/01/2025',
    updatedAt: '06/01/2025',
  },
  {
    id: '4',
    title: 'Criar API de tarefas',
    description: 'CRUD completo de tarefas',
    status: 'IN_PROGRESS',
    createdAt: '11/01/2025',
    updatedAt: '13/01/2025',
  },
  {
    id: '5',
    title: 'Validação de formulários',
    description: 'Zod com react-hook-form',
    status: 'PENDING',
    createdAt: '14/01/2025',
    updatedAt: '14/01/2025',
  },
]

/* =========================
 * Mapeamentos
 * ========================= */

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
  onDelete?: (taskId: string) => void
  onNavigate?: (taskId: string) => void
}

const TableData = ({ onDelete, onNavigate }: TableDataProps) => {
  const handleDelete = (taskId: string) => {
    console.log('Deletar task:', taskId)
    onDelete?.(taskId)
  }

  const handleNavigate = (taskId: string) => {
    onNavigate?.(taskId)
  }

  return (
    <div className="bg-card rounded-lg border">
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
          {tasksMock.map((task) => (
            <TableRow
              key={task.id}
              className="group hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{task.title}</TableCell>

              <TableCell className="text-muted-foreground">
                {task.description ?? '—'}
              </TableCell>

              <TableCell>
                <Badge variant={statusVariant[task.status]}>
                  {statusLabel[task.status]}
                </Badge>
              </TableCell>

              <TableCell>{task.createdAt}</TableCell>
              <TableCell>{task.updatedAt}</TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleNavigate(task.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { TableData }
