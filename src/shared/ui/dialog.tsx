'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@lib/utils'

interface DialogContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog: React.FC<DialogProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  
  const open = useCallback(() => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(true)
    } else {
      setInternalOpen(true)
    }
  }, [controlledOpen, onOpenChange])
  
  const close = useCallback(() => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(false)
    } else {
      setInternalOpen(false)
    }
  }, [controlledOpen, onOpenChange])

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild = false }) => {
  const { open } = useDialog()
  
  return (
    <button onClick={open} type="button">
      {children}
    </button>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

const DialogContent: React.FC<DialogContentProps> = ({ 
  children, 
  className,
  showCloseButton = true 
}) => {
  const { isOpen, close } = useDialog()
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, close])
  
  if (!isOpen) return null
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "bg-background relative z-50 w-full max-w-lg rounded-lg border p-6 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          {showCloseButton && (
            <button
              onClick={close}
              className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>
    </DialogPortal>
  )
}

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const DialogOverlay: React.FC = () => {
  const { close } = useDialog()
  
  return (
    <div
      className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
      onClick={close}
    />
  )
}

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex flex-col gap-2 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>
      {children}
    </div>
  )
}

const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}

const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}

const DialogClose: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { close } = useDialog()
  
  return (
    <button
      onClick={close}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children}
    </button>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  useDialog
} 