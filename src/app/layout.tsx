import './globals.css'

import type { Metadata } from 'next'
import { Sansation as Font } from 'next/font/google'
import { ReactNode } from 'react'

import { MainProviders } from '@/shared/providers'

export const defaultFont = Font({
  variable: '--font-sans',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'TaskFlow',
  description:
    'TaskFlow é uma aplicação de gerenciamento de tarefas focada em produtividade, organização e fluxo de trabalho, ajudando você a planejar, priorizar e acompanhar suas atividades com clareza.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${defaultFont.variable} relative min-h-screen antialiased`}
      >
        <MainProviders>{children}</MainProviders>
      </body>
    </html>
  )
}
