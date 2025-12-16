'use client'

import { Button } from '@/shared/components'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/shadcn/table'

/* =========================
 * TABLE EMPTY
 * ========================= */

type TableEmptyProps = {
  onCreate?: () => void
}
const TableEmpty = ({ onCreate }: TableEmptyProps) => {
  return (
    <Table className="w-full">
      <TableHeader className="bg-muted/60">
        <TableRow className="[&_th]:py-3">
          <TableHead className="min-w-55">Título</TableHead>
          <TableHead className="min-w-70">Descrição</TableHead>
          <TableHead className="min-w-35">Status</TableHead>
          <TableHead className="min-w-35">Criada em</TableHead>
          <TableHead className="min-w-40">Atualizada em</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="py-14 text-center">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
              <h2 className="text-foreground text-lg font-semibold">
                Bem-vindo ao seu quadro de tarefas 👋
              </h2>

              <p className="text-muted-foreground text-center text-sm leading-relaxed wrap-break-word">
                Nenhuma tarefa foi criada ainda. Aqui você pode organizar
                ideias, <br />
                planejar atividades e acompanhar o progresso do seu dia.
              </p>

              {onCreate && (
                <Button onClick={onCreate} className="h-9 px-4">
                  + Criar primeira tarefa
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export { TableEmpty }
