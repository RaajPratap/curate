'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-widest text-foreground-secondary mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-background-tertiary border-2 border-border text-white font-mono',
            'px-4 py-3 placeholder:text-foreground-muted placeholder:uppercase placeholder:text-xs placeholder:tracking-wider',
            'focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none',
            'transition-colors duration-100',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs font-mono uppercase tracking-wider text-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-2 text-xs font-mono text-foreground-muted">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
