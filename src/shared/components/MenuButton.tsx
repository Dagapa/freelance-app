import { Button } from '@/shared/ui/button';
import { useSidebar } from '../hooks/useSidebar';

export function MenuButton() {
  const { toggle } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggle}
      aria-label="Abrir menú"
    >
      <div className="space-y-2">
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
      </div>
    </Button>
  );
}
