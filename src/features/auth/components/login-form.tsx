'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, MailIcon } from 'lucide-react'
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

import { LoginUserSchema, loginUserSchema } from '../schemas/login-user-schema'

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    mode: 'all',
  })

  const onSubmit = handleSubmit((data: LoginUserSchema) => {
    // handle login
    console.log(data)
  })

  return (
    <Card className="border-muted/60 bg-card/90 relative z-10 w-full max-w-120 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Acesse sua conta</CardTitle>
        <CardDescription className="text-center">
          Entre no TaskFlow para gerenciar suas tarefas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={onSubmit}>
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
            icon={LockIcon}
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <ButtonWithLoading type="submit" className="mt-8 w-full">
            Entrar
          </ButtonWithLoading>
        </form>
        <ButtonWithLoading variant="link" className="w-full justify-center">
          <Link
            href="/auth/register"
            className="text-primary text-sm font-medium hover:underline"
          >
            Criar conta
          </Link>
        </ButtonWithLoading>
      </CardContent>
    </Card>
  )
}

export { LoginForm }
