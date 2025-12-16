'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  CreateTaskSchema,
  createTaskSchema,
} from '@/features/task/skemas/create-task-schema'
import { ProcessMessageResponse } from '@/shared/components'

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
import { useCreateMutation } from '../hooks/mutations/create-task-mutation'

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  defaultValues?: CreateTaskSchema
}

export function CreateTaskModal({
  open,
  onClose,
  defaultValues,
}: CreateTaskModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      status: 'PENDING',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open && defaultValues) {
      reset(defaultValues)
    } else if (open && !defaultValues) {
      reset({
        title: '',
        description: '',
        status: 'PENDING',
      })
    }
  }, [open, defaultValues, reset])

  const createTask = useCreateMutation()

  const handleSubmitForm = async (data: CreateTaskSchema) => {
    await createTask.mutateAsync({
      ...data,
      status: data.status || 'PENDING',
    })
    reset()
    onClose()
  }

  return (
    <ProcessMessageResponse
      titleSuccess="Tarefa criada com sucesso! 🎉"
      successMessage="A nova tarefa foi adicionada à sua lista."
      error={createTask.error}
      isSuccess={createTask.isSuccess}
      titleError="Erro ao criar tarefa"
    >
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
              disabled={createTask.isPending}
              error={errors.title?.message}
            />

            <TextareaIcon
              id="description"
              label="Descrição"
              placeholder="Digite a descrição da tarefa"
              {...register('description')}
              disabled={createTask.isPending}
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
                    disabled={createTask.isPending}
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
                disabled={createTask.isPending}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={createTask.isPending}>
                Criar tarefa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ProcessMessageResponse>
  )
}
