'use client'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { UserMenu } from '@/features/auth/components/user-menu'
import { useState, useEffect } from 'react';

import { MenuButton } from './MenuButton';
import useResizeWindow from '../hooks/useResizeWindow';
import { SidebarContext } from './SidebarContext';

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { width } = useResizeWindow();

  useEffect(() => {
    if (width && width >= 768) {
      setIsOpen(false);
    }
  }, [width]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen]);
  
  const toggle = () => setIsOpen(prev => !prev)
  const close = () => setIsOpen(false)
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6">
        <MenuButton />
        
        <div className="md:hidden font-semibold">Freelance Finance</div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
    </SidebarContext.Provider>
  )
}
