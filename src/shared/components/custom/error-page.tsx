import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import Link from 'next/link'

import { Button } from '../shadcn/button'
import { AnimatedIcons } from './animated-icons'
import { TaskFlowLogo } from './task-flow-logo'

type ErrorPageProps = {
  errorCode?: number | string
  title?: string
  message?: string
  errorId?: string | number

  // server-safe
  homeHref?: string

  // client-only (não usar em not-found.tsx)
  onRetry?: () => void

  showRetry?: boolean
  showGoHome?: boolean
}

const DEFAULT_MESSAGES: Record<string, { title: string; message: string }> = {
  '404': {
    title: 'Page not found',
    message: 'The page you are looking for does not exist or was moved.',
  },
  '500': {
    title: 'Internal server error',
    message: 'Something went wrong on our side. Please try again later.',
  },
  default: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
}

const ErrorPage = ({
  errorCode,
  title,
  message,
  errorId,
  homeHref,
  onRetry,
  showRetry = true,
  showGoHome = true,
}: ErrorPageProps) => {
  const fallback =
    DEFAULT_MESSAGES[String(errorCode)] ?? DEFAULT_MESSAGES.default

  const resolvedTitle = title ?? fallback.title
  const resolvedMessage = message ?? fallback.message

  return (
    <div className="bg-background text-foreground relative flex min-h-screen items-center justify-center">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-primary/15 to-destructive/15 absolute -top-24 -left-24 h-72 w-[140%] rounded-full bg-linear-to-br blur-3xl" />
        <div className="to-primary/10 absolute -right-32 -bottom-32 h-80 w-[120%] rounded-full bg-linear-to-tr from-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 px-6 text-center">
        {/* logo */}
        <TaskFlowLogo />

        {/* error code */}
        {errorCode && (
          <div className="text-destructive text-7xl font-bold tracking-tight">
            {errorCode}
          </div>
        )}

        <div className="flex items-center gap-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {resolvedTitle}
          </h1>
        </div>

        <p className="text-muted-foreground text-sm md:text-base">
          {resolvedMessage}
          {errorId && (
            <>
              {' '}
              <span className="text-foreground font-medium">
                Error ID:
              </span>{' '}
              <span className="text-muted-foreground font-mono">{errorId}</span>
            </>
          )}
        </p>

        <AnimatedIcons />

        {/* actions */}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {showRetry && onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          )}

          {showGoHome && homeHref && (
            <Button asChild variant="outline" className="gap-2">
              <Link href={homeHref}>
                <Home className="h-4 w-4" />
                Go to home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { ErrorPage }
