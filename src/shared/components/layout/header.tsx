import { ThemeToggle } from '@/shared/components/theme-toggle'
import { UserMenu } from '@/modules/auth/components/user-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6">
      <div className="md:hidden font-semibold">Freelance Finance</div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
