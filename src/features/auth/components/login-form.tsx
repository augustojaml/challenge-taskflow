'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, LogInIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import {
  ButtonWithLoading,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InputIcon,
  ProcessMessageResponse,
} from '@/shared/components'
import { useAuth } from '@/shared/providers/auth-provider'

import { useLoginMutation } from '../hooks/mutations/login-user-mutation'
import { LoginUserSchema, loginUserSchema } from '../schemas/login-user-schema'

const LoginForm = () => {
  const { login } = useAuth()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    mode: 'all',
  })

  const loginUser = useLoginMutation()

  const onSubmit = handleSubmit(async (data: LoginUserSchema) => {
    const result = await loginUser.mutateAsync(data)
    login(result.token, result.user)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).location.assign('/')
  })

  return (
    <ProcessMessageResponse
      titleSuccess="Login realizado com sucesso! 🎉"
      successMessage="Redirecionando para o dashboard..."
      error={loginUser.error}
      isSuccess={loginUser.isSuccess}
      titleError="Erro ao fazer login"
    >
      <Card className="border-muted/60 bg-card/90 relative z-10 w-full max-w-120 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            Acesse sua conta
          </CardTitle>
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

            <ButtonWithLoading
              type="submit"
              className="mt-8 w-full"
              isLoading={loginUser.isPending}
              disabled={loginUser.isPending}
              iconLeft={LogInIcon}
            >
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
    </ProcessMessageResponse>
  )
}

export { LoginForm }
