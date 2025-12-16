import { Loader2 } from 'lucide-react'

import { AnimatedIcons } from './animated-icons'
import { TaskFlowLogo } from './task-flow-logo'

type LoadingPageProps = {
  title?: string
  message?: string
}

const LoadingPage = ({
  title = 'Carregando...',
  message = 'Estamos preparando tudo para você. Aguarde um instante.',
}: LoadingPageProps) => {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen items-center justify-center">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-primary/15 to-secondary/15 absolute -top-24 -left-24 h-72 w-[140%] rounded-full bg-linear-to-br blur-3xl" />
        <div className="to-primary/10 absolute -right-32 -bottom-32 h-80 w-[120%] rounded-full bg-linear-to-tr from-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 px-6 text-center">
        {/* logo */}
        <div>
          <TaskFlowLogo />
        </div>

        {/* loading icon */}
        <div className="text-primary flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
        </div>

        <p className="text-muted-foreground text-sm md:text-base">{message}</p>

        {/* subtle animated icons */}
        <AnimatedIcons />
      </div>
    </div>
  )
}

export { LoadingPage }
