'use client'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { UserMenu } from '@/features/auth/components/user-menu'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">      
      <div className="flex flex-1 items-center justify-end gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
