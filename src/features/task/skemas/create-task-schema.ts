import z from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
      message: 'Status inválido',
    })
    .default('PENDING')
    .optional(),
})

type CreateTaskSchema = z.infer<typeof createTaskSchema>

export { type CreateTaskSchema, createTaskSchema }
