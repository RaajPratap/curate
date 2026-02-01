'use client'

import { cn } from '@/lib/utils'

interface ImpactStatsProps {
  carbonSaved: number // in kg
  waterSaved: number // in liters
  ordersCount: number
  variant?: 'horizontal' | 'vertical' | 'compact'
}

const ImpactStats = ({
  carbonSaved,
  waterSaved,
  ordersCount,
  variant = 'horizontal',
}: ImpactStatsProps) => {
  const stats = [
    {
      value: carbonSaved.toFixed(1),
      unit: 'kg',
      label: 'CO₂ Saved',
      description: 'vs industry average',
      icon: '🌱',
    },
    {
      value: waterSaved.toFixed(0),
      unit: 'L',
      label: 'Water Saved',
      description: 'in production',
      icon: '💧',
    },
    {
      value: ordersCount,
      unit: '',
      label: 'Sustainable Orders',
      description: 'making a difference',
      icon: '📦',
    },
  ]

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-1">
            <span>{stat.icon}</span>
            <span className="font-mono text-accent">
              {stat.value}{stat.unit}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        variant === 'horizontal' ? 'grid-cols-3' : 'grid-cols-1'
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border border-border p-4 text-center"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="font-display text-2xl md:text-3xl font-bold text-accent">
            {stat.value}
            <span className="text-lg">{stat.unit}</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground-secondary mt-1">
            {stat.label}
          </p>
          {variant === 'vertical' && (
            <p className="font-mono text-xs text-foreground-muted mt-1">
              {stat.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export { ImpactStats }
