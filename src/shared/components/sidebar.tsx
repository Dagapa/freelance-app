'use client';

import { useEffect } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { useSidebar } from './header'
import {
  HomeIcon,
  LineChartIcon,
  ListOrderedIcon,
  SettingsIcon,
  WalletIcon,
  X
} from 'lucide-react'

export function Sidebar() {
  const { isOpen, close } = useSidebar()
  const pathname = usePathname()
  
  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    close()
  }, [pathname, close])
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transacciones', href: '/transactions', icon: ListOrderedIcon },
    // { name: 'Reportes', href: '/reports', icon: LineChartIcon },
    // { name: 'Presupuesto', href: '/budget', icon: WalletIcon },
    // { name: 'Configuración', href: '/settings', icon: SettingsIcon },
  ]

  return (
    <>
      {/* Sidebar de escritorio (siempre visible en md+) */}
      <aside className="hidden border-r bg-muted/40 md:block w-64">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span>Freelance Finance</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay para cerrar el sidebar móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={close}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar móvil */}
      <div 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-background transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span>Freelance Finance</span>
            </Link>
            <button 
              className="ml-auto p-2 rounded-full hover:bg-muted" 
              onClick={close}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
