import { Skeleton } from '@/shared/components/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/shadcn/table'

type TableSkeletonProps = {
  rows?: number
}

export const TasksTableSkeleton = ({ rows = 5 }: TableSkeletonProps) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="[&_th]:py-3">
          <TableHead className="min-w-55">Título</TableHead>
          <TableHead className="min-w-70">Descrição</TableHead>
          <TableHead className="min-w-35">Status</TableHead>
          <TableHead className="min-w-35">Criada em</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index} className="[&_td]:py-4">
            <TableCell>
              <Skeleton className="h-4 w-45" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-60" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-5 w-27.5 rounded-full" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-25" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-30" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
