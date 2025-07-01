import React from 'react'
import { cn } from '@lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "border-input bg-background text-foreground placeholder:text-muted-foreground",
        "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-vertical",
        className
      )}
      {...props}
    />
  )
}

export { Textarea } 