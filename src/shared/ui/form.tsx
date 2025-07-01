'use client'

import React, { createContext, useContext, useId } from 'react'
import { cn } from '@lib/utils'

interface FormFieldContextValue {
  id: string
  error?: string
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

const useFormField = () => {
  const context = useContext(FormFieldContext)
  if (!context) {
    throw new Error('useFormField must be used within a FormField')
  }
  return context
}

// Simple form wrapper for react-hook-form
interface FormProps {
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

const Form: React.FC<FormProps> = ({ children, className, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      {children}
    </form>
  )
}

// FormField for react-hook-form compatibility
interface FormFieldProps {
  control?: any
  name: string
  render: (props: { field: any }) => React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ render }) => {
  return <>{render({ field: {} })}</>
}

interface FormItemProps {
  children: React.ReactNode
  className?: string
}

const FormItem: React.FC<FormItemProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}

interface FormLabelProps {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}

const FormLabel: React.FC<FormLabelProps> = ({ children, className, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  )
}

interface FormControlProps {
  children: React.ReactNode
  className?: string
}

const FormControl: React.FC<FormControlProps> = ({ children, className }) => {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

interface FormDescriptionProps {
  children: React.ReactNode
  className?: string
}

const FormDescription: React.FC<FormDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}

interface FormMessageProps {
  children?: React.ReactNode
  className?: string
}

const FormMessage: React.FC<FormMessageProps> = ({ children, className }) => {
  if (!children) {
    return null
  }

  return (
    <p
      className={cn(
        "text-sm font-medium text-destructive",
        className
      )}
    >
      {children}
    </p>
  )
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField
} 