'use client'

import { User, LogOut } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { createClient } from '@lib/supabase/client'
import { Dropdown } from '@shared/components/dropdown'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">Menú de usuario</span>
        </Button>
      }
      content={
        <section className='flex flex-col gap-2 px-2 shadow'>
          <div className="px-4 py-2 text-sm font-semibold border-b ">Mi Cuenta</div>
          <div className="px-4 py-2 text-sm cursor-pointer hover:bg-accent flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </div>
          <div className="px-4 py-2 text-sm cursor-pointer hover:bg-accent flex items-center" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </div>
        </section>
      }
      align="end"
    />
  )
}
