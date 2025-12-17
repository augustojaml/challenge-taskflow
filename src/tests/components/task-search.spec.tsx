import { fireEvent, render, screen, within } from '@testing-library/react'
import React, { createContext, useContext } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { TaskSearch } from '@/features/task/components/task-search'

vi.mock('@/shared/helpers/useDebounce', () => ({
  useDebounce: (value: string) => value,
}))

const SelectContext = createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

vi.mock('@/shared/components', () => ({
  Input: ({ value, ...rest }: { value: string }) => (
    <input value={value} {...rest} data-testid="search-input" />
  ),
}))

vi.mock('@/shared/components/shadcn/select', () => {
  const Select = ({
    value,
    onValueChange,
    children,
  }: {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
  }) => (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  )

  const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  )

  const SelectValue = ({ placeholder }: { placeholder: string }) => {
    const ctx = useContext(SelectContext)
    return (
      <div data-testid="select-value">
        {ctx.value && ctx.value !== '' ? ctx.value : placeholder}
      </div>
    )
  }

  const SelectContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  )

  const SelectItem = ({
    value,
    children,
  }: {
    value: string
    children: React.ReactNode
  }) => {
    const ctx = useContext(SelectContext)
    return (
      <button onClick={() => ctx.onValueChange?.(value)}>{children}</button>
    )
  }

  return {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  }
})

describe('TaskSearch', () => {
  it('should call onChange when search input changes', () => {
    const onChange = vi.fn()

    render(<TaskSearch onChange={onChange} />)

    const input = screen.getByPlaceholderText('Pesquisar tarefa')
    fireEvent.change(input, { target: { value: 'foo' } })

    expect(onChange).toHaveBeenCalledWith({ search: '', status: '' })
    expect(onChange).toHaveBeenCalledWith({ search: 'foo', status: '' })
  })

  it('should call onChange when status changes', () => {
    const onChange = vi.fn()

    render(<TaskSearch onChange={onChange} />)

    const selectContent = screen.getByTestId('select-content')
    fireEvent.click(within(selectContent).getByText('Pendente'))

    expect(onChange).toHaveBeenCalledWith({ search: '', status: 'PENDING' })
  })
})
