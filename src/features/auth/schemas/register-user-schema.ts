import { z } from 'zod'

const registerUserSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.email('Informe um endereço de e-mail válido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
})

type RegisterUserSchema = z.infer<typeof registerUserSchema>

export { type RegisterUserSchema, registerUserSchema }
