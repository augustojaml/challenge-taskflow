'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/shared/libs/utils'
import { useTheme } from '@/shared/providers/theme-provider'

export const ButtonTheme = () => {
  const { toggleTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleMount = () => {
    setMounted(true)
  }

  useEffect(() => {
    handleMount()
  }, [])

  if (!mounted) return null

  return (
    <div
      onClick={toggleTheme}
      className={cn(
        'rounded-full p-2 shadow-md transition-colors',
        theme === 'light'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border-border bg-muted text-foreground hover:bg-muted/80 border',
      )}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </div>
  )
}
