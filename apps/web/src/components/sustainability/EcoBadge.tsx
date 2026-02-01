'use client'

import { cn } from '@/lib/utils'

interface EcoBadgeProps {
  rating: 'A' | 'B' | 'C' | 'D' | 'F'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const ratingInfo = {
  A: {
    label: 'Excellent',
    description: 'Best-in-class sustainability',
    color: 'eco-green',
    bgColor: 'bg-eco-green/10',
    borderColor: 'border-eco-green',
  },
  B: {
    label: 'Good',
    description: 'Above average sustainability',
    color: 'eco-green',
    bgColor: 'bg-eco-green/10',
    borderColor: 'border-eco-green/50',
  },
  C: {
    label: 'Average',
    description: 'Industry standard sustainability',
    color: 'eco-yellow',
    bgColor: 'bg-eco-yellow/10',
    borderColor: 'border-eco-yellow',
  },
  D: {
    label: 'Below Average',
    description: 'Room for improvement',
    color: 'eco-red',
    bgColor: 'bg-eco-red/10',
    borderColor: 'border-eco-red/50',
  },
  F: {
    label: 'Poor',
    description: 'Significant improvement needed',
    color: 'eco-red',
    bgColor: 'bg-eco-red/10',
    borderColor: 'border-eco-red',
  },
}

const EcoBadge = ({ rating, size = 'md', showLabel = false }: EcoBadgeProps) => {
  const info = ratingInfo[rating]

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  }

  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={cn(
          'flex items-center justify-center font-display font-bold border-2',
          sizes[size],
          info.bgColor,
          info.borderColor,
          `text-${info.color}`
        )}
      >
        {rating}
      </div>
      {showLabel && (
        <div>
          <p className={cn('font-mono text-sm font-semibold', `text-${info.color}`)}>
            {info.label}
          </p>
          <p className="font-mono text-xs text-foreground-muted">{info.description}</p>
        </div>
      )}
    </div>
  )
}

export { EcoBadge, ratingInfo }
