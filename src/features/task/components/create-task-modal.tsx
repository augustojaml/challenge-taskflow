'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef } from 'react'
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
import { useCreateMutation } from '../hooks/mutations/create-task-mutation'
import { useUpdateMutation } from '../hooks/mutations/update-task-mutation'
import { DefaultTask } from '../screens/task'

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  defaultValues?: DefaultTask
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
    mode: 'all',
  })

  const createTask = useCreateMutation()
  const updateTask = useUpdateMutation()

  const onReset = useCallback(() => {
    reset({
      title: '',
      description: '',
      status: 'PENDING',
    })
    onClose()
  }, [onClose, reset])

  const onSubmitForm = handleSubmit(async (data: CreateTaskSchema) => {
    if (!defaultValues?.id) {
      await createTask.mutateAsync({
        ...data,
        status: data.status || 'PENDING',
      })
    } else {
      await updateTask.mutateAsync({
        id: defaultValues.id,
        ...data,
        status: data.status || 'PENDING',
      })
    }
    onReset()
  })
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const formKey = open ? (defaultValues?.id ?? 'create') : 'closed'

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description,
        status: defaultValues.status,
      })
    }
  }, [defaultValues, reset])

  return (
    <Dialog open={open} onOpenChange={onReset}>
      <DialogContent
        className="sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
        </DialogHeader>

        <form key={formKey} className="space-y-6">
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
              onClick={() => {
                onReset()
              }}
              disabled={createTask.isPending}
            >
              Cancelar
            </Button>

            <Button
              ref={confirmButtonRef}
              type="submit"
              onClick={onSubmitForm}
              disabled={createTask.isPending}
            >
              {defaultValues?.id ? 'Atualizar tarefa' : 'Criar tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
