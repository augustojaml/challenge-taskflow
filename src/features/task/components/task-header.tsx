import { PlusIcon } from 'lucide-react'

import { ButtonWithLoading } from '@/shared/components'

interface TaskTableHeaderProps {
  hasData?: boolean
  onOpen?: () => void
}

const TaskHeader = ({ hasData, onOpen }: TaskTableHeaderProps) => {
  return (
    <div className="mb-6 flex w-full items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-foreground text-lg font-semibold">
          Visão geral das tarefas
        </h2>

        <p className="text-muted-foreground text-xs">
          Gerencie seu trabalho, acompanhe prioridades e avance com suas
          atividades.
        </p>
      </div>

      {/* button aligned right */}
      <ButtonWithLoading
        iconLeft={PlusIcon}
        disabled={!hasData}
        onClick={onOpen}
      >
        Create Task
      </ButtonWithLoading>
    </div>
  )
}

export { TaskHeader }
