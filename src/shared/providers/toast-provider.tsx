'use client'

import * as Toast from '@radix-ui/react-toast'
import { clsx } from 'clsx'
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  XCircle,
} from 'lucide-react'
import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning'
export type ToastPosition = 'top-right' | 'bottom-right'

export interface ShowToastOptions {
  message: string
  type?: ToastType
  position?: ToastPosition
  title?: string
  duration?: number
}

interface ToastItem extends ShowToastOptions {
  id: string
}

interface CustomToastContextProps {
  // eslint-disable-next-line no-unused-vars
  showToast: (options: ShowToastOptions) => void
}

const CustomToastContext = createContext<CustomToastContextProps | undefined>(
  undefined,
)

export const CustomToastProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback(
    ({
      message,
      type = 'default',
      position = 'bottom-right',
      title,
      duration = 3000,
    }: ShowToastOptions) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: ToastItem = {
        id,
        message,
        type,
        position,
        title,
        duration,
      }

      setToasts((prev) => [...prev, newToast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    },
    [],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const variant = useMemo(
    () => ({
      default: {
        icon: <Circle className="text-chart-1 h-5 w-5" />,
        border: 'border-l-4 border-chart-1',
        ring: 'ring-1 ring-chart-1/20',
        blobs: 'from-chart-1/15 to-primary/15',
        title: 'Notice',
      },
      success: {
        icon: <CheckCircle2 className="text-chart-2 h-5 w-5" />,
        border: 'border-l-4 border-chart-2',
        ring: 'ring-1 ring-chart-2/20',
        blobs: 'from-chart-2/15 to-primary/15',
        title: 'Success',
      },
      error: {
        icon: <XCircle className="text-destructive h-5 w-5" />,
        border: 'border-l-4 border-destructive',
        ring: 'ring-1 ring-destructive/20',
        blobs: 'from-destructive/15 to-primary/15',
        title: 'Error',
      },
      info: {
        icon: <Info className="text-chart-4 h-5 w-5" />,
        border: 'border-l-4 border-chart-4',
        ring: 'ring-1 ring-chart-4/20',
        blobs: 'from-chart-4/15 to-primary/15',
        title: 'Info',
      },
      warning: {
        icon: <AlertTriangle className="text-chart-3 h-5 w-5" />,
        border: 'border-l-4 border-chart-3',
        ring: 'ring-1 ring-chart-3/20',
        blobs: 'from-chart-3/15 to-primary/15',
        title: 'Warning',
      },
    }),
    [],
  )

  return (
    <CustomToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right" duration={3000}>
        {toasts.map((toast) => {
          const v = variant[toast.type ?? 'default']
          const positionClass =
            toast.position === 'top-right'
              ? 'top-6 right-6'
              : 'bottom-6 right-6'

          return (
            <Toast.Root
              key={toast.id}
              open={true}
              onOpenChange={(open) => {
                if (!open) removeToast(toast.id)
              }}
              className={clsx(
                'fixed z-[60] w-full max-w-sm rounded-xl',
                positionClass,
                'data-[state=open]:animate-in data-[state=open]:fade-in-50 data-[state=open]:slide-in-from-right-5',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-50 data-[state=closed]:slide-out-to-right-5',
                'data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-5 data-[swipe=end]:fade-out-50 data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)',
              )}
            >
              <div
                className={clsx(
                  'border-border bg-card/90 text-foreground relative flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur',
                  v.border,
                  v.ring,
                )}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <div
                    className={clsx(
                      'absolute -top-24 -left-24 h-72 w-[140%] rounded-full bg-gradient-to-br blur-3xl',
                      v.blobs,
                    )}
                  />
                  <div
                    className={clsx(
                      'absolute -right-32 -bottom-32 h-80 w-[120%] rounded-full bg-gradient-to-tr blur-3xl',
                      v.blobs,
                    )}
                  />
                </div>
                <div className="relative z-10 mt-0.5">{v.icon}</div>
                <div className="relative z-10 min-w-0 flex-1">
                  <Toast.Title className="line-clamp-1 text-sm font-semibold">
                    {toast.title ?? v.title}
                  </Toast.Title>
                  <Toast.Description className="text-muted-foreground mt-0.5 line-clamp-3 text-sm">
                    {toast.message}
                  </Toast.Description>
                </div>
                <Toast.Close
                  className={clsx(
                    'text-muted-foreground relative z-10 ml-2 rounded-md px-1.5 py-0.5 text-sm transition-colors',
                    'hover:text-foreground focus:ring-ring/40 focus:ring-2 focus:outline-none',
                  )}
                  aria-label="Close"
                  onClick={() => removeToast(toast.id)}
                >
                  x
                </Toast.Close>
              </div>
            </Toast.Root>
          )
        })}
        <Toast.Viewport />
      </Toast.Provider>
    </CustomToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(CustomToastContext)
  if (!ctx)
    throw new Error('useToast must be used within a CustomToastProvider')
  return ctx
}
