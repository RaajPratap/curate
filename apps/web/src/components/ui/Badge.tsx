'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'eco-a' | 'eco-b' | 'eco-c' | 'eco-d' | 'eco-f'
  size?: 'sm' | 'md'
}

const Badge = ({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center gap-1 font-mono uppercase tracking-wider border'
  
  const variants = {
    default: 'bg-background-tertiary text-foreground-secondary border-border',
    accent: 'bg-accent/10 text-accent border-accent',
    success: 'bg-success/10 text-success border-success',
    warning: 'bg-warning/10 text-warning border-warning',
    error: 'bg-error/10 text-error border-error',
    'eco-a': 'bg-eco-green/10 text-eco-green border-eco-green',
    'eco-b': 'bg-eco-green/10 text-eco-green border-eco-green/50',
    'eco-c': 'bg-eco-yellow/10 text-eco-yellow border-eco-yellow',
    'eco-d': 'bg-eco-red/10 text-eco-red border-eco-red/50',
    'eco-f': 'bg-eco-red/10 text-eco-red border-eco-red',
  }
  
  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  }

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
