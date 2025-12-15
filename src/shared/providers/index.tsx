'use client'

import type { ReactNode } from 'react'

import { AuthProvider } from './auth-provider'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import { CustomToastProvider } from './toast-provider'

const PROVIDERS = [
  { component: ThemeProvider, key: 'themeProvider' },
  { component: CustomToastProvider, key: 'toastProvider' },
  { component: QueryClientProvider, key: 'queryClientProvider' },
  { component: AuthProvider, key: 'authProvider' },
]

export const MainProviders = ({ children }: { children: ReactNode }) => {
  const wrappedProviders = PROVIDERS.reduceRight(
    (acc, { component: Provider }) => <Provider>{acc}</Provider>,
    children,
  )

  return (
    <div className="bg-background min-h-screen antialiased">
      {wrappedProviders}
    </div>
  )
}
