'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import {
  CreateTaskSchema,
  createTaskSchema,
} from '@/features/task/skemas/create-task-schema'

import { InputIcon } from '../../../shared/components/custom/input-icon'
import { TextareaIcon } from '../../../shared/components/custom/textare-icon'
import { Button } from '../../../shared/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/shadcn/dialog'
import { Label } from '../../../shared/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/shadcn/select'

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskSchema) => Promise<void> | void
}

export function CreateTaskModal({
  open,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: 'PENDING',
    },
  })

  const handleSubmitForm = async (data: CreateTaskSchema) => {
    await onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <InputIcon
            id="title"
            label="Título"
            placeholder="Digite o título da tarefa"
            {...register('title')}
            disabled={isSubmitting}
            error={errors.title?.message}
          />

          <TextareaIcon
            id="description"
            label="Descrição"
            placeholder="Digite a descrição da tarefa"
            {...register('description')}
            disabled={isSubmitting}
            error={errors.description?.message}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Criar tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
