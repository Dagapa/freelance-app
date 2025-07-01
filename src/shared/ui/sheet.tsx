import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@lib/utils';
import { X } from 'lucide-react';

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet: React.FC<SheetProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const open = () => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  const close = () => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, open, close } as any);
        }
        return child;
      })}
    </div>
  );
};

interface SheetTriggerProps {
  children: React.ReactNode;
  open?: () => void;
}

const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, open }) => (
  <button type="button" onClick={open}>
    {children}
  </button>
);

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  close?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const sideClasses = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
};

const SheetContent: React.FC<SheetContentProps> = ({ children, isOpen, close, className, side = 'right', ...props }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        close?.();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={close} />
      <div
        ref={contentRef}
        className={cn(
          'fixed z-50 bg-background p-6 shadow-lg transition ease-in-out',
          sideClasses[side],
          className
        )}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={close}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>
        {children}
      </div>
    </div>
  );
};

const SheetClose: React.FC<{ children?: React.ReactNode; close?: () => void }> = ({ children, close }) => (
  <button type="button" onClick={close} className="mt-4">
    {children || 'Cerrar'}
  </button>
);

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);

const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props} />
);

const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SheetOverlay = () => null;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
