import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import {
  HomeIcon,
  LineChartIcon,
  ListOrderedIcon,
  SettingsIcon,
  WalletIcon,
} from 'lucide-react'

export function DashboardSidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transacciones', href: '/transactions', icon: ListOrderedIcon },
    { name: 'Reportes', href: '/reports', icon: LineChartIcon },
    { name: 'Presupuesto', href: '/budget', icon: WalletIcon },
    { name: 'Configuración', href: '/settings', icon: SettingsIcon },
  ]

  return (
    <aside className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>Freelance Finance</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
