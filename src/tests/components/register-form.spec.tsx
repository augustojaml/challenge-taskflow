import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/* =========================
 * Mocks
 * ========================= */

let mutateAsyncMock: ReturnType<typeof vi.fn>
const useRegisterMutation = vi.hoisted(() => vi.fn())

vi.mock('@/features/auth/hooks/mutations/regiter-user-mutation', () => ({
  useRegisterMutation,
}))

vi.mock('@/shared/providers/toast-provider', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

/* =========================
 * SUT
 * ========================= */

import { RegisterForm } from '@/features/auth/components/register-form'

describe('REGISTER FORM', () => {
  beforeEach(() => {
    mutateAsyncMock = vi.fn()
    vi.mocked(useRegisterMutation).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isSuccess: false,
      error: null,
      data: null,
    })

    render(<RegisterForm />)
  })

  it('Should be able to render main register texts', () => {
    const [cardTitle] = screen.getAllByText('Criar conta')
    expect(cardTitle).toBeInTheDocument()

    expect(
      screen.getByText(
        'Crie sua conta no TaskFlow e comece a organizar suas tarefas',
      ),
    ).toBeInTheDocument()
  })

  it('Should be able to type name, email and password', () => {
    const nameInput = screen.getByLabelText('Usuário') as HTMLInputElement
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement

    fireEvent.change(nameInput, {
      target: { value: 'John Doe' },
    })

    fireEvent.change(emailInput, {
      target: { value: 'john@example.com' },
    })

    fireEvent.change(passwordInput, {
      target: { value: '12345678' },
    })

    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(passwordInput.value).toBe('12345678')
  })

  it('Should be able to register with valid data', async () => {
    mutateAsyncMock.mockResolvedValueOnce({
      message: 'Usuário criado com sucesso',
    })

    fireEvent.change(screen.getByLabelText('Usuário'), {
      target: { value: 'John Doe' },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })

    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345678',
      })
    })
  })

  it('Should not be able to submit form with empty fields', async () => {
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled()
    })
  })

  it('Should disable submit button when loading', () => {
    cleanup()
    mutateAsyncMock = vi.fn()
    vi.mocked(useRegisterMutation).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: true,
      isSuccess: false,
      error: null,
      data: null,
    })

    render(<RegisterForm />)

    const [button] = screen.getAllByRole('button', {
      name: /criar conta/i,
    })

    expect(button).toBeDisabled()
  })

  it('Should render link to login page', () => {
    const link = screen.getByRole('link', {
      name: /já tenho uma conta/i,
    })

    expect(link).toHaveAttribute('href', '/auth/login')
  })
})
