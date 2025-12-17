'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, ShieldCheckIcon, UserIcon, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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

import { useRegisterMutation } from '../hooks/mutations/regiter-user-mutation'
import {
  RegisterUserSchema,
  registerUserSchema,
} from '../schemas/register-user-schema'

const RegisterForm = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    mode: 'all',
  })

  const registerUser = useRegisterMutation()
  const router = useRouter()

  useEffect(() => {
    if (!registerUser.isSuccess) {
      return undefined
    }

    const timeout = setTimeout(() => {
      router.push('/auth/login')
    }, 1200)

    return () => {
      clearTimeout(timeout)
    }
  }, [registerUser.isSuccess, router])

  const onSubmit = handleSubmit(async (data: RegisterUserSchema) => {
    await registerUser.mutateAsync(data)
  })

  return (
    <ProcessMessageResponse
      titleSuccess="Tudo certo! 🎉"
      successMessage={registerUser.data?.message}
      error={registerUser.error}
      isSuccess={registerUser.isSuccess}
      titleError="Erro ao criar usuário"
      onReset={reset}
    >
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

            <ButtonWithLoading
              type="submit"
              className="mt-8 w-full"
              isLoading={registerUser.isPending}
              disabled={registerUser.isPending}
              iconLeft={UserPlus}
            >
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
    </ProcessMessageResponse>
  )
}

export { RegisterForm }
