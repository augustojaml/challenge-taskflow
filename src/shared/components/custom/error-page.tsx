'use client'

import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import Link from 'next/link'

import { Button } from '@/shared/components/shadcn/button'

type ErrorNumbersWaveProps = {
  numbers?: number[]
  title?: string
  message?: string
  errorId?: string | number
  errorCode?: number
  onRetry?: () => void
  onGoHome?: () => void
  size?: 'sm' | 'md' | 'lg'
  duration?: number
  delayStep?: number
}

export function DefaultError({
  numbers = [4, 0, 4],
  title = 'Algo deu errado',
  message = 'Não foi possível carregar o conteúdo. Tente novamente.',
  errorId,
  errorCode,
  onRetry,
  onGoHome,
  size = 'md',
  duration = 1.0,
  delayStep = 0.08,
}: ErrorNumbersWaveProps) {
  const dims = useMemo(() => {
    switch (size) {
      case 'sm':
        return { circle: 'h-8 w-8', text: 'text-xs' }
      case 'lg':
        return { circle: 'h-14 w-14', text: 'text-xl' }
      default:
        return { circle: 'h-11 w-11', text: 'text-sm' }
    }
  }, [size])

  return (
    <div className="bg-background text-foreground relative flex min-h-screen items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-primary/15 to-destructive/15 absolute -top-24 -left-24 h-72 w-[140%] rounded-full bg-gradient-to-br blur-3xl" />
        <div className="to-primary/10 absolute -right-32 -bottom-32 h-80 w-[120%] rounded-full bg-gradient-to-tr from-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 px-6 text-center">
        <div className="bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur">
          <span className="bg-destructive inline-block h-2 w-2 animate-pulse rounded-full" />
          {errorCode ? `erro-${errorCode}` : 'app-error'}
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </h1>
        </div>

        <p className="text-muted-foreground text-sm text-pretty md:text-base">
          {message}
          {errorId ? (
            <>
              {' '}
              <span className="text-foreground font-medium">Error ID:</span>{' '}
              <span className="text-muted-foreground font-mono">{errorId}</span>
            </>
          ) : null}
        </p>

        <div className="mt-2 flex items-end gap-3">
          {numbers.map((n, i) => (
            <div
              key={`${n}-${i}`}
              className={`border-destructive/30 bg-card/80 text-destructive grid place-items-center rounded-full border shadow-sm ${dims.circle} ${dims.text} animate-number-glitch will-change-transform`}
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${i * delayStep}s`,
              }}
              aria-hidden="true"
            >
              <span className="font-semibold tabular-nums">{n}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button variant="default" onClick={onRetry} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/" onClick={onGoHome}>
              <Home className="h-4 w-4" />
              Go to home
            </Link>
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes number-glitch {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.95; }
          15% { transform: translate(-2%, -6%) rotate(-1.2deg) scale(1.06); opacity: 1; }
          30% { transform: translate(2.5%, 5%) rotate(1.2deg) scale(0.98); opacity: 0.9; }
          45% { transform: translate(-3%, 2%) rotate(-0.8deg) scale(1.04); opacity: 0.95; }
          60% { transform: translate(3%, -3%) rotate(0.8deg) scale(0.97); opacity: 0.9; }
          75% { transform: translate(-1%, 3%) rotate(-0.4deg) scale(1.02); opacity: 0.95; }
        }
        .animate-number-glitch {
          animation-name: number-glitch;
          animation-timing-function: cubic-bezier(.22,.61,.36,1);
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

