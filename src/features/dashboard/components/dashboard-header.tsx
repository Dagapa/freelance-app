'use client'

import { Button } from '@/shared/ui/button'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { UserMenu } from '@/features/auth/components/user-menu'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'
import { DashboardSidebar } from '../../../shared/components/sidebar'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
