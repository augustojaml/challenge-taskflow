'use client'

import { Label } from '@radix-ui/react-label'
import { MailIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/shared/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn/card'
import { Input } from '@/shared/components/shadcn/input'

const RegisterForm = () => {
  return (
    <Card className="border-muted/60 bg-card/90 relative z-10 w-full max-w-120 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Criar conta</CardTitle>
        <CardDescription className="text-center">
          Crie sua conta no TaskFlow e comece a organizar suas tarefas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            // handle submit
          }}
        >
          {/* Nome de usuário */}
          <div className="space-y-2">
            <Label htmlFor="name">Usuário</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center">
                <UserIcon className="text-muted-foreground h-4 w-4" />
              </span>
              <Input
                id="name"
                placeholder="seu usuário"
                className="pl-9"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center">
                <MailIcon className="text-muted-foreground h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center">
                <ShieldCheckIcon className="text-muted-foreground h-4 w-4" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* submit */}
          <Button type="submit" className="w-full">
            Criar conta
          </Button>

          {/* Login */}
          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="text-primary text-sm font-medium hover:underline"
            >
              Já tenho uma conta
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { RegisterForm }
