'use client'

import { QueryClientProvider as ClientProvider } from '@tanstack/react-query'
import { type FC, type ReactNode } from 'react'

import { queryClient } from '@/shared/libs'

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ClientProvider client={queryClient}>{children}</ClientProvider>
}
