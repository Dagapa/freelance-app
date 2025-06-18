import { Menu } from './menu'
import { ThemeToggle } from '@shared/components/theme-toggle'
import { UserMenu } from '@/features/auth/components/user-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background p-2 md:position-relative sm:h-auto sm:px-6">
      <div className="font-semibold ml-9 lg:ml-0">Finance Tracker</div>
      <Menu />
      <div className="flex items-center justify-end gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
