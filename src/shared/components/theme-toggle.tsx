'use client'

import { Moon, Sun } from 'lucide-react';
import { Switch } from './switch';
import useTheme from '@shared/hooks/useTheme'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex items-center">
      <Switch
        iconOn={<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />}
        iconOff={<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
        isChecked={theme === 'dark'}
        onChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  )
}
