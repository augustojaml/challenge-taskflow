import { z } from 'zod'

const loginUserSchema = z.object({
  email: z.email('Informe um endereço de e-mail válido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
})

type LoginUserSchema = z.infer<typeof loginUserSchema>

export { type LoginUserSchema, loginUserSchema }
