import Link from "next/link";
import { Button } from "@shared/ui/button";

interface SidebarNavItemsProps {
  navItems: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
  close: () => void;
  pathname: string;
}

export function MenuItems({ navItems, close, pathname }: SidebarNavItemsProps) {
  return (
    <section className="flex flex-col w-full px-2 gap-1 text-sm font-medium lg:px-4 lg:flex-row">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.name}
            variant="ghost"
            onClick={close}
            className={`w-full justify-start ${isActive ? 'bg-muted' : ''}`}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 w-full text-muted-foreground transition-all`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </section>
  );
}