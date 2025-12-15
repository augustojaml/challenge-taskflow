import { ReactNode } from 'react'

import { BackgroundGlow } from '@/shared/components'

const TaskLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <BackgroundGlow />
      {children}
    </div>
  )
}

export default TaskLayout
