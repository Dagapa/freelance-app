'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ListOrderedIcon,
  MenuIcon,
  XIcon
} from 'lucide-react'
import { useSidebar } from '../hooks/useSidebar';
import { MenuItems } from './menuItems';
import { Button } from '@shared/ui/button';

export function Menu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { close } = useSidebar();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transacciones', href: '/transactions', icon: ListOrderedIcon },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="lg:hidden absolute left-2 z-50">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>

      <nav
        className={`hidden lg:flex inset-y-0 left-0 z-50 h-fit w-fit border-2 border-muted rounded-lg transition-all duration-300 ease-in-out`}
      >
        <div className="overflow-auto py-2">
          <MenuItems navItems={navItems} close={close} pathname={pathname} />
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileMenu}></div>
      )}

      <nav
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-background border-l border-muted transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="overflow-auto py-2 pt-16">
          <MenuItems navItems={navItems} close={() => { close(); setIsMobileMenuOpen(false); }} pathname={pathname} />
        </div>
      </nav>
    </>
  )
}
