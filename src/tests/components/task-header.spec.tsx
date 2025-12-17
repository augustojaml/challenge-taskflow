import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { TaskHeader } from '@/features/task/components/task-header'

describe('TaskHeader', () => {
  it('should render the header text and call onOpen when the button is clicked', () => {
    const onOpen = vi.fn()

    render(<TaskHeader hasData onOpen={onOpen} />)

    expect(
      screen.getByRole('heading', { name: /Visão geral das tarefas/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Gerencie seu trabalho/i)).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /create task/i })
    expect(button).toBeEnabled()
    button.click()
    expect(onOpen).toHaveBeenCalled()
  })

  it('should disable the button when there is no data', () => {
    render(<TaskHeader hasData={false} onOpen={vi.fn()} />)
    const button = screen.getByRole('button', { name: /create task/i })
    expect(button).toBeDisabled()
  })
})
