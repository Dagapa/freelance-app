import React from 'react'
import { cn } from '@lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'default' | 'sm'
}

const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }

  const sizeClasses = {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { Badge } 