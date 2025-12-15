'use client'

import { Label } from '@radix-ui/react-label'
import { ShieldCheckIcon, UserIcon } from 'lucide-react'

import { Button } from '@/shared/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn/card'
import { Input } from '@/shared/components/shadcn/input'

const LoginForm = () => {
  return (
    <Card className="border-muted/60 bg-card/90 relative z-10 w-full max-w-120 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Acesse sua conta</CardTitle>
        <CardDescription className="text-center">
          Entre no TaskFlow para gerenciar suas tarefas
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
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* submit */}
          <Button type="submit" className="w-full">
            Entrar
          </Button>

          {/* Register */}
          <div className="flex justify-center">
            <a
              href="#"
              className="text-primary text-sm font-medium hover:underline"
            >
              Criar conta
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { LoginForm }
