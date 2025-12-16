import { InfoIcon, LucideIcon } from 'lucide-react'
import { ComponentProps } from 'react'

import { cn } from '@/shared/libs'

import { Label } from '../shadcn/label'
import { Textarea } from '../shadcn/textarea'

interface TextareaWithIconProps extends ComponentProps<typeof Textarea> {
  id: string
  label?: string
  icon?: LucideIcon
  error?: string
}

const TextareaIcon = ({
  id,
  label,
  icon: Icon,
  error,
  className,
  ...rest
}: TextareaWithIconProps) => {
  const hasError = !!error

  return (
    <div className="relative mb-4">
      <div className="space-y-1.5">
        {label && (
          <Label
            htmlFor={id}
            /* className={cn(hasError && 'text-destructive')} */
          >
            {label}
          </Label>
        )}

        <div className="group relative">
          <Textarea
            id={id}
            {...rest}
            className={cn(
              'flex w-full resize-none rounded-md bg-transparent text-sm transition-colors outline-none',
              'min-h-24 px-3 py-2',
              'ring-offset-background border',
              'placeholder:text-muted-foreground',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',

              // padding quando há ícone
              Icon && 'pl-9',

              // 🔥 estado normal
              !hasError &&
                'border-input focus-visible:border-ring focus-visible:ring-ring',

              // // 🔥 estado de erro (pronto para ativar)
              // hasError &&
              //   'border-destructive/50 text-destructive placeholder:text-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive',

              className,
            )}
          />

          {Icon && (
            <span className="pointer-events-none absolute top-3 left-3">
              <Icon className="text-muted-foreground h-4 w-4 transition-colors" />
            </span>
          )}
        </div>
      </div>

      {hasError && (
        <div className="mt-1.5 flex items-center gap-1">
          <InfoIcon className="text-destructive h-3 w-3" />
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}

export { TextareaIcon }
