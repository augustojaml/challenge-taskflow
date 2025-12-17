'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/shared/components'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { useDebounce } from '@/shared/helpers/useDebounce'

type TaskSearchProps = {
  onChange: (params: { search: string; status: string }) => void
}

const TaskSearch = ({ onChange }: TaskSearchProps) => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    onChange({
      search: debouncedSearch,
      status,
    })
  }, [debouncedSearch, status, onChange])

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        <Input
          id="search"
          type="text"
          placeholder="Pesquisar tarefa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full md:w-fit"
        />

        <div className="h-12 space-y-1.5 md:h-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10! w-full md:w-fit">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as categorias</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
              <SelectItem value="COMPLETED">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export { TaskSearch }
