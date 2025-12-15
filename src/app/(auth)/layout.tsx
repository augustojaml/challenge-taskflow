import { ReactNode } from 'react'

import { BackgroundGlow } from '@/shared/components/custom'
import { AnimatedIcons } from '@/shared/components/custom/animated-icons'
import { TaskFlowLogo } from '@/shared/components/custom/task-flow-logo'

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* page container */}
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
        {/* LEFT: brand + messaging */}
        <div className="relative hidden items-center justify-center p-8 md:flex">
          {/* background glow */}
          <BackgroundGlow />

          <div className="relative z-10 max-w-md">
            {/* logo */}
            <TaskFlowLogo />

            {/* heading */}
            <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              organize tarefas <br />
              <span className="text-primary">com foco e clareza</span>
            </h1>

            {/* short description */}
            <p className="text-muted-foreground mt-4 text-base">
              Planeje, acompanhe e conclua tarefas com mais produtividade.
              Transforme atividades em fluxos simples e eficientes no seu dia a
              dia.
            </p>

            {/* animated icons */}
            <AnimatedIcons />
          </div>
        </div>

        {/* RIGHT: auth content */}
        <div className="flex w-full flex-col items-center justify-center px-8 md:px-4">
          <div className="flex flex-col items-center justify-center py-8 md:hidden">
            <TaskFlowLogo />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
