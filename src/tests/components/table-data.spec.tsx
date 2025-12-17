import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { TableData } from '@/features/task/components/table-data'

vi.mock('@/features/task/components/table-skeleton', () => ({
  TasksTableSkeleton: () => <div data-testid="table-skeleton" />,
}))

vi.mock('@/features/task/components/table-pagination', () => ({
  TablePagination: ({
    total,
    page,
    size,
    onPageChange,
    onSizeChange,
  }: {
    total?: number
    page?: number
    size?: number
    onPageChange?: (page: number) => void
    onSizeChange?: (size: number) => void
  }) => (
    <div data-testid="table-pagination">
      <button type="button" onClick={() => onPageChange?.((page ?? 0) + 1)}>
        next
      </button>
      <button type="button" onClick={() => onSizeChange?.((size ?? 0) + 5)}>
        size
      </button>
      <span>page {page}</span>
      <span>total {total}</span>
    </div>
  ),
}))

const task = {
  id: 'task-1',
  title: 'Task 1',
  description: 'Task description',
  status: 'PENDING' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('TableData', () => {
  it('should render tasks and call edit/delete handlers', () => {
    const onSelect = vi.fn()
    const onDelete = vi.fn()
    render(
      <TableData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={[task] as any}
        total={1}
        page={1}
        size={5}
        onSelect={onSelect}
        onDelete={onDelete}
      />,
    )

    const row = screen.getAllByRole('row')[1]
    const [selectButton, deleteButton] = within(row).getAllByRole('button')

    fireEvent.click(selectButton)
    fireEvent.click(deleteButton)

    expect(onSelect).toHaveBeenCalledWith(task)
    expect(onDelete).toHaveBeenCalledWith(task)
    expect(screen.getByText(task.title)).toBeInTheDocument()
    expect(screen.getByText(task.description)).toBeInTheDocument()
    expect(screen.getByText(/at/)).toBeInTheDocument()
  })

  it('should render pagination controls and fire callbacks', () => {
    const onPageChange = vi.fn()
    const onSizeChange = vi.fn()
    render(
      <TableData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={[task] as any}
        total={10}
        page={2}
        size={5}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
      />,
    )

    const pagination = screen.getByTestId('table-pagination')
    fireEvent.click(within(pagination).getByText('next'))
    fireEvent.click(within(pagination).getByText('size'))

    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onSizeChange).toHaveBeenCalledWith(10)
    expect(within(pagination).getByText('total 10')).toBeInTheDocument()
  })

  it('should render skeleton when loading', () => {
    render(<TableData isLoading />)

    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('should render empty state and call onOpenCreate', () => {
    const onOpenCreate = vi.fn()

    render(<TableData data={[]} onOpenCreate={onOpenCreate} />)

    fireEvent.click(
      screen.getByRole('button', { name: /\+ criar primeira tarefa/i }),
    )

    expect(onOpenCreate).toHaveBeenCalled()
    expect(
      screen.getByText(/nenhuma tarefa foi criada ainda/i),
    ).toBeInTheDocument()
  })
})
