import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DeleteTaskModal } from '@/features/task/components/delete-task-modal'

describe('DELETE TASK MODAL', () => {
  const onConfirm = vi.fn(() => Promise.resolve())
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be able to confirm deletion and close dialog', async () => {
    const task = {
      id: '1',
      title: 'Task A',
      description: 'Desc A',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    render(
      <DeleteTaskModal
        open
        onClose={onClose}
        onConfirm={onConfirm}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        task={task as any}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /excluir tarefa/i }))

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })

    expect(screen.getByText('Título:')).toBeInTheDocument()
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Descrição:')).toBeInTheDocument()
    expect(screen.getByText('Desc A')).toBeInTheDocument()
  })

  it('should be able to show fallback labels when no task provided', () => {
    render(<DeleteTaskModal open onClose={onClose} onConfirm={onConfirm} />)

    expect(screen.getByText('Título:')).toBeInTheDocument()
    expect(screen.getByText('Tarefa sem título')).toBeInTheDocument()
    expect(screen.getByText('Descrição:')).toBeInTheDocument()
    expect(screen.getByText('Tarefa sem descrição')).toBeInTheDocument()
  })

  it('should disable actions when deletion is in progress', () => {
    render(
      <DeleteTaskModal
        open
        onClose={onClose}
        onConfirm={onConfirm}
        isDeleting
      />,
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    const deleteButton = screen.getByRole('button', { name: /excluir tarefa/i })

    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })
})
