'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@lib/utils'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toastWithId = { ...newToast, id }
    
    setToasts(prev => [...prev, toastWithId])

    // Auto dismiss
    if (newToast.duration !== 0) {
      setTimeout(() => {
        dismiss(id)
      }, newToast.duration || 5000)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  dismiss: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, dismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} dismiss={dismiss} />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: Toast
  dismiss: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ toast, dismiss }) => {
  const variantClasses = {
    default: "bg-background border",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-500 text-white"
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-center justify-between rounded-lg border p-4 shadow-lg",
        "animate-in slide-in-from-right-full duration-300",
        variantClasses[toast.variant || 'default']
      )}
    >
      <div className="flex-1">
        {toast.title && (
          <div className="font-semibold">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => dismiss(toast.id)}
        className="ml-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
} 