'use client'

import type { ReactNode } from 'react'

import { AuthProvider } from './auth-provider'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import { CustomToastProvider } from './toast-provider'

const PROVIDERS = [
  { component: ThemeProvider, key: 'themeProvider' },
  { component: CustomToastProvider, key: 'toastProvider' },
  { component: AuthProvider, key: 'authProvider' },
]

export const MainProviders = ({ children }: { children: ReactNode }) => {
  // QueryClientProvider deve ser o mais externo para que AuthProvider possa usar useQueryClient
  const innerProviders = PROVIDERS.reduceRight(
    (acc, { component: Provider }) => <Provider>{acc}</Provider>,
    children,
  )

  return (
    <QueryClientProvider>
      <div className="bg-background min-h-screen antialiased">
        {innerProviders}
      </div>
    </QueryClientProvider>
  )
}
