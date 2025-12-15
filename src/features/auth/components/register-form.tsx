'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { ButtonWithLoading } from '@/shared/components/custom/button-with-loading'
import { InputIcon } from '@/shared/components/custom/input-icon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn/card'

import {
  RegisterUserSchema,
  registerUserSchema,
} from '../schemas/register-user-schema'

const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    mode: 'all',
  })

  const onSubmit = handleSubmit((data: RegisterUserSchema) => {
    // handle login
    console.log(data)
  })

  return (
    <Card className="border-muted/60 bg-card/90 relative z-10 w-full max-w-120 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Criar conta</CardTitle>
        <CardDescription className="text-center">
          Crie sua conta no TaskFlow e comece a organizar suas tarefas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          <InputIcon
            id="name"
            label="Usuário"
            icon={UserIcon}
            {...register('name')}
            error={errors.name?.message}
          />

          <InputIcon
            id="email"
            label="Email"
            icon={MailIcon}
            {...register('email')}
            error={errors.email?.message}
          />

          <InputIcon
            id="password"
            label="Senha"
            icon={ShieldCheckIcon}
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />

          <ButtonWithLoading type="submit" className="mt-8 w-full">
            Criar conta
          </ButtonWithLoading>
        </form>
        <ButtonWithLoading variant="link" className="w-full justify-center">
          <Link
            href="/auth/login"
            className="text-primary text-sm font-medium hover:underline"
          >
            Já tenho uma conta
          </Link>
        </ButtonWithLoading>
      </CardContent>
    </Card>
  )
}

export { RegisterForm }
