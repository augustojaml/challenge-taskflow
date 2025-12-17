import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/* =========================
 * Mocks
 * ========================= */

let loginMock: ReturnType<typeof vi.fn>
let mutateAsyncMock: ReturnType<typeof vi.fn>

vi.mock('@/shared/providers/auth-provider', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

vi.mock('@/features/auth/hooks/mutations/login-user-mutation', () => ({
  useLoginMutation: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isSuccess: false,
    error: null,
  }),
}))

vi.mock('@/shared/providers/toast-provider', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

/* =========================
 * SUT
 * ========================= */

import { LoginForm } from '@/features/auth/components/login-form'

describe('LOGIN FORM', () => {
  beforeEach(() => {
    loginMock = vi.fn()
    mutateAsyncMock = vi.fn()

    Object.defineProperty(globalThis, 'location', {
      value: { assign: vi.fn() },
      writable: true,
    })

    render(<LoginForm />)
  })

  it('should be able to render main login texts', () => {
    expect(screen.getByText('Acesse sua conta')).toBeInTheDocument()

    expect(
      screen.getByText('Entre no TaskFlow para gerenciar suas tarefas'),
    ).toBeInTheDocument()
  })

  it('should be able to type email and password', () => {
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    })

    fireEvent.change(passwordInput, {
      target: { value: '12345678' },
    })

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('12345678')
  })

  it('should be able to login with valid credentials', async () => {
    mutateAsyncMock.mockResolvedValueOnce({
      token: 'fake-token',
      user: {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '12345678',
      })
    })

    expect(loginMock).toHaveBeenCalledWith(
      'fake-token',
      expect.objectContaining({
        id: 'user-id',
      }),
    )
  })

  it('should redirect to home after successful login', async () => {
    const assignMock = vi.fn()

    Object.defineProperty(globalThis, 'location', {
      value: { assign: assignMock },
      writable: true,
    })

    mutateAsyncMock.mockResolvedValueOnce({
      token: 'fake-token',
      user: { id: 'user-id' },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: '12345678' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('/')
    })
  })

  it('should not be able to submit form with empty fields', async () => {
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled()
    })
  })
})
