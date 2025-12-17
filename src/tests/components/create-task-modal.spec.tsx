import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CreateTaskModal } from '@/features/task/components/create-task-modal'

const useCreateMutation = vi.hoisted(() => vi.fn())
const useUpdateMutation = vi.hoisted(() => vi.fn())

vi.mock('@/features/task/hooks/mutations/create-task-mutation', () => ({
  useCreateMutation,
}))

vi.mock('@/features/task/hooks/mutations/update-task-mutation', () => ({
  useUpdateMutation,
}))

describe('CreateTaskModal', () => {
  const createMutateMock = vi.fn()
  const updateMutateMock = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(useCreateMutation).mockReturnValue({
      mutateAsync: createMutateMock,
      isPending: false,
      isSuccess: false,
      error: null,
      data: null,
    })

    vi.mocked(useUpdateMutation).mockReturnValue({
      mutateAsync: updateMutateMock,
      isPending: false,
      isSuccess: false,
      error: null,
      data: null,
    })
  })

  it('should be able to create a task when the form is submitted', async () => {
    render(<CreateTaskModal open onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'My task' },
    })
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Details' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }))

    await waitFor(() => {
      expect(createMutateMock).toHaveBeenCalledWith({
        title: 'My task',
        description: 'Details',
        status: 'PENDING',
      })
    })

    expect(onClose).toHaveBeenCalled()
    expect(updateMutateMock).not.toHaveBeenCalled()
  })

  it('should be able to use update mutation when default values are provided', async () => {
    const defaultValues = {
      id: 'task-1',
      title: 'Existing',
      description: 'existing desc',
      status: 'IN_PROGRESS' as const,
    }

    render(
      <CreateTaskModal open defaultValues={defaultValues} onClose={onClose} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /atualizar tarefa/i }))

    await waitFor(() => {
      expect(updateMutateMock).toHaveBeenCalledWith({
        ...defaultValues,
        status: 'IN_PROGRESS',
      })
    })

    expect(createMutateMock).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
