'use client'

import { Separator } from '@radix-ui/react-select'
import { AlertTriangle, Trash2 } from 'lucide-react'

import { ButtonWithLoading } from '@/shared/components'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'

interface DeleteTaskModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  isDeleting?: boolean
  taskTitle?: string
  taskId?: string
}

const DeleteTaskModal = ({
  open,
  onClose,
  onConfirm,
  isDeleting = false,
  taskTitle,
  taskId,
}: DeleteTaskModalProps) => {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="text-destructive h-5 w-5" />
            Excluir tarefa
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info da tarefa */}
          <div className="border-destructive/30 bg-destructive/5 rounded-md border p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-destructive mt-0.5 h-4 w-4" />
              <div className="min-w-0 text-sm">
                <p className="text-foreground font-medium">
                  Você está prestes a excluir:
                </p>
                <p className="text-muted-foreground truncate">
                  {taskTitle ?? 'Tarefa sem título'}
                  {taskId && (
                    <span className="ml-1 font-mono text-xs">({taskId})</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <ButtonWithLoading
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar
            </ButtonWithLoading>

            <ButtonWithLoading
              type="button"
              variant="destructive"
              iconLeft={Trash2}
              onClick={handleConfirm}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Excluir tarefa
            </ButtonWithLoading>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteTaskModal }
