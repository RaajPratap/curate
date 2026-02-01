'use client'

import { cn } from '@/lib/utils'

interface CarbonFootprintProps {
  value: number // in kg CO₂
  average?: number // industry average for comparison
  showComparison?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const CarbonFootprint = ({
  value,
  average = 15,
  showComparison = true,
  size = 'md',
}: CarbonFootprintProps) => {
  const percentageBetter = Math.round(((average - value) / average) * 100)
  const isBetter = percentageBetter > 0

  const sizes = {
    sm: {
      value: 'text-lg',
      label: 'text-xs',
    },
    md: {
      value: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      value: 'text-4xl',
      label: 'text-base',
    },
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className={cn('font-display font-bold text-accent', sizes[size].value)}>
          {value.toFixed(1)}
        </span>
        <span className="font-mono text-foreground-muted text-sm">kg CO₂</span>
      </div>

      {showComparison && (
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="h-2 bg-background-tertiary border border-border relative">
            <div
              className={cn(
                'h-full transition-all',
                isBetter ? 'bg-eco-green' : 'bg-eco-red'
              )}
              style={{ width: `${Math.min(100, (value / average) * 100)}%` }}
            />
            {/* Average marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-foreground-muted"
              style={{ left: '100%' }}
              title={`Industry average: ${average} kg`}
            />
          </div>

          {/* Comparison text */}
          <p className={cn('font-mono', sizes[size].label)}>
            {isBetter ? (
              <span className="text-eco-green">
                {Math.abs(percentageBetter)}% better than average
              </span>
            ) : (
              <span className="text-eco-red">
                {Math.abs(percentageBetter)}% above average
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export { CarbonFootprint }
