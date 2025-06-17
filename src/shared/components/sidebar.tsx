'use client';

import { Button } from '@/shared/ui/button'
import { usePathname } from 'next/navigation'
import {
  XIcon,
  MenuIcon,
  HomeIcon,
  ListOrderedIcon,
} from 'lucide-react'
import { useSidebar } from '../hooks/useSidebar';
import { SidebarNavItems } from './sidebar/sidebarItems';

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useSidebar()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transacciones', href: '/transactions', icon: ListOrderedIcon },
  ]

  return (
    <>
      <aside
        className={`
          inset-y-0 left-0 z-50 flex h-screen flex-col border-2 border-muted rounded-lg transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'w-64' : 'w-20'}
          md:relative md:translate-x-0 md:block
        `}
      >
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Button
              className="flex items-center gap-2 w-full font-semibold bg-muted/40 text-white hover:bg-muted/60"
              onClick={toggle}
              size={isOpen ? 'default' : 'icon'}
            >
              {isOpen ? <span>Freelance Finance</span> : <MenuIcon />}
            </Button>
            <button
              className="ml-auto p-2 rounded-full hover:bg-muted md:hidden"
              onClick={close}
              aria-label="Cerrar menú"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNavItems navItems={navItems} close={close} pathname={pathname} isOpen={isOpen} />
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  )
}
