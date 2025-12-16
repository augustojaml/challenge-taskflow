'use client'

import { Bell, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useLogoutMutation } from '@/features/auth/hooks/mutations/logout-user-mutation'
import { useGetMe } from '@/features/auth/hooks/queries/use-get-me'
import { getInitialsLetterName } from '@/shared/helpers'
import { cn } from '@/shared/libs'

import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar'
import { Button } from '../shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu'
import { ButtonTheme } from './button-theme'
import { TaskFlowLogo } from './task-flow-logo'

const UserMenuSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
    </div>
  )
}

const MainHeader = () => {
  const { data: user, isLoading } = useGetMe()
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync()
    router.push('/auth/login')
  }

  return (
    <header className="bg-card/80 border-border/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold">
          <TaskFlowLogo />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <ButtonTheme />

          {isLoading ? (
            <UserMenuSkeleton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'relative h-10 rounded-full px-2 hover:bg-transparent',
                    user?.name ? 'pr-3 pl-2' : 'h-10 w-10 justify-center',
                  )}
                  aria-label="Open user menu"
                >
                  <Avatar className="bg-primary/10 text-primary h-9 w-9 rounded-full">
                    <AvatarImage
                      src={user?.avatarUrl || undefined}
                      alt={user?.name || user?.email || 'User avatar'}
                      className="h-full w-full rounded-full object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {getInitialsLetterName({
                        name: user?.name,
                        email: user?.email,
                      })}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="space-y-1">
                  <div className="truncate text-sm font-medium">
                    {user?.name}
                  </div>
                  <div className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export { MainHeader }
