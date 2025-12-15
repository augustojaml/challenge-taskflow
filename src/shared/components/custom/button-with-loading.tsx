import { Loader2, LucideIcon } from 'lucide-react'
import { ComponentProps } from 'react'

import { cn } from '@/shared/libs'

import { Button } from '../shadcn/button'

interface ButtonWithLoadingProps extends ComponentProps<typeof Button> {
  isLoading?: boolean
  iconLeft?: LucideIcon
  iconRight?: LucideIcon
}

export function ButtonWithLoading({
  children,
  isLoading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  disabled,
  className,
  ...rest
}: ButtonWithLoadingProps) {
  return (
    <Button
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2',
        className,
      )}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        IconLeft && <IconLeft className="h-4 w-4" aria-hidden="true" />
      )}

      <span>{children}</span>

      {!isLoading && IconRight && (
        <IconRight className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  )
}
