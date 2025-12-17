'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/shared/components/shadcn/button'
import { cn } from '@/shared/libs/utils'

interface TablePaginationProps {
  total?: number
  page?: number
  size?: number
  onPageChange?: (page: number) => void
  onSizeChange?: (size: number) => void
}

const PAGE_SIZES = [5, 10, 20, 50]

const TablePagination = ({
  total = 0,
  page = 0,
  size = 5,
  onPageChange,
  onSizeChange,
}: TablePaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, size)))

  const firstIndex = total === 0 ? 0 : (page - 1) * size + 1
  const lastIndex = Math.min(page * size, total)

  const canPrev = page > 1
  const canNext = page < pageCount

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-xl border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <span className="text-muted-foreground hidden text-xs sm:block">
        <span>mostrando </span>
        <span className="text-foreground font-medium">
          {firstIndex}–{lastIndex}
        </span>{' '}
        de <span className="text-foreground font-medium">{total}</span> itens
      </span>

      <div className="flex flex-wrap items-center justify-between gap-3 md:justify-start">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden text-xs sm:block">
            linhas por página
          </span>

          <select
            value={size}
            onChange={(e) => onSizeChange?.(Number(e.target.value))}
            disabled={!total}
            className={cn(
              'bg-card text-foreground h-8 rounded-md border px-2 text-xs',
              'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
            )}
          >
            {PAGE_SIZES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Page info + navigation */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            página <span className="text-foreground font-medium">{page}</span>{' '}
            de <span className="text-foreground font-medium">{pageCount}</span>
          </span>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={!canPrev}
              onClick={() => onPageChange?.(1)}
              aria-label="Primeira página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={!canPrev}
              onClick={() => onPageChange?.(page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={!canNext}
              onClick={() => onPageChange?.(page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={!canNext}
              onClick={() => onPageChange?.(pageCount)}
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TablePagination }
