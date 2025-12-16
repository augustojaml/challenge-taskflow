import { ReactNode } from 'react'

import { BackgroundGlow } from '@/shared/components'
import { MainHeader } from '@/shared/components/custom/main-header'

const TaskLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <BackgroundGlow />
      <MainHeader />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

export default TaskLayout
