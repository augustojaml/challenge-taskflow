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

  // 🔔 notifica o componente pai
  useEffect(() => {
    onChange({
      search: debouncedSearch,
      status,
    })
  }, [debouncedSearch, status, onChange])

  return (
    <div className="mb-4 flex gap-4">
      <Input
        id="search"
        type="text"
        placeholder="Pesquisar tarefa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-fit"
      />

      <div className="h-12 space-y-1.5">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10!">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Todas as Categorias</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
            <SelectItem value="COMPLETED">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export { TaskSearch }
