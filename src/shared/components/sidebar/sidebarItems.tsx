import Link from "next/link";
import { Button } from "@/shared/ui/button";

interface SidebarNavItemsProps {
  navItems: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
  close: () => void;
  pathname: string;
  isOpen: boolean;
}

export function SidebarNavItems({ navItems, close, pathname, isOpen }: SidebarNavItemsProps) {
  return (
    <nav className="grid items-start w-full px-2 gap-3 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.name}
            variant="ghost"
            onClick={close}
            size="icon"
            className={`${isOpen ? 'w-full' : 'w-12'} ${isActive ? 'bg-muted' : ''}`}
          >
            <Link 
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 w-full text-muted-foreground transition-all`}
            >
              <Icon className="h-4 w-4" />
              {isOpen && item.name}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}