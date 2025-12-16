import { ComponentProps, useMemo } from 'react'

import { TaskStatus } from '@/shared/core/types/task-status'
import { cn } from '@/shared/libs'

import { Badge } from '../shadcn/badge'

interface BadgeStatusProps extends ComponentProps<typeof Badge> {
  status?: TaskStatus
}

export function BadgeStatus({
  status = 'PENDING',
  className,
  ...rest
}: BadgeStatusProps) {
  const variant: Record<TaskStatus, { bg: string; title: string }> = useMemo(
    () => ({
      COMPLETED: {
        bg: 'bg-green-700/10 text-green-500 border-green-500',
        title: 'Open',
      },
      IN_PROGRESS: {
        bg: 'bg-orange-700/10 text-red-500 border-red-500',
        title: 'Closed',
      },
      PENDING: {
        bg: 'bg-yellow-700/10 text-yellow-500 border-yellow-500',
        title: 'Pending',
      },
    }),
    [],
  )

  return (
    <Badge
      variant="secondary"
      className={cn('flex items-center gap-1', className, variant[status].bg)}
      {...rest}
    >
      {variant[status].title}
    </Badge>
  )
}
