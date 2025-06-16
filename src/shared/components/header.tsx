'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { UserMenu } from '@/features/auth/components/user-menu'
import { Button } from '@/shared/ui/button'
import { Menu } from 'lucide-react'

// Creamos un contexto para compartir el estado del sidebar
import { createContext, useContext } from 'react'

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Cerrar el sidebar cuando cambia el tamaño de la ventana a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Prevenir scroll cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])
  
  const toggle = () => setIsOpen(prev => !prev)
  const close = () => setIsOpen(false)
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6">
        {/* Botón de menú hamburguesa (solo visible en móvil) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo (solo visible en móvil) */}
        <div className="md:hidden font-semibold">Freelance Finance</div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
    </SidebarContext.Provider>
  )
}
