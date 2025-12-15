'use client'

import { ReactNode, useEffect } from 'react'

import { getResponseErrorCode } from '@/shared/helpers'
import { useToast } from '@/shared/providers/toast-provider'

interface IProcessErrorProps {
  position?: 'bottom-right' | 'top-right'
  error?: Error | null
  successMessage?: string
  titleSuccess?: string
  titleError?: string
  isSuccess?: boolean
  onReset?: () => void
  children?: ReactNode
}

export const ProcessMessageResponse = ({
  successMessage,
  position = 'top-right',
  error,
  isSuccess,
  titleSuccess = 'Signing in successfully',
  titleError = 'Signing in error',
  onReset,
  children,
}: IProcessErrorProps) => {
  const { showToast } = useToast()

  useEffect(() => {
    if (isSuccess && successMessage) {
      showToast({
        type: 'success',
        message: successMessage,
        title: titleSuccess,
        position,
        duration: 5000,
      })
      onReset?.()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        message: getResponseErrorCode(error),
        title: titleError,
        position,
        duration: 5000,
      })
      onReset?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return children
}
