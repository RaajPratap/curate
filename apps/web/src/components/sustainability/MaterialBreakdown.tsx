'use client'

import { cn } from '@/lib/utils'

interface Material {
  name: string
  percentage: number
  isRecycled?: boolean
  isOrganic?: boolean
}

interface MaterialBreakdownProps {
  materials: Material[]
  variant?: 'bar' | 'list'
}

const MaterialBreakdown = ({ materials, variant = 'bar' }: MaterialBreakdownProps) => {
  const getColorForMaterial = (material: Material): string => {
    if (material.isRecycled) return 'bg-accent'
    if (material.isOrganic) return 'bg-eco-green'
    return 'bg-foreground-muted'
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {materials.map((material) => (
          <div key={material.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-3 h-3',
                  getColorForMaterial(material)
                )}
              />
              <span className="font-mono text-sm">{material.name}</span>
              {material.isRecycled && (
                <span className="font-mono text-xs text-accent">♻️</span>
              )}
              {material.isOrganic && (
                <span className="font-mono text-xs text-eco-green">🌱</span>
              )}
            </div>
            <span className="font-mono text-sm text-accent">{material.percentage}%</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Stacked bar */}
      <div className="h-4 flex overflow-hidden border border-border">
        {materials.map((material, index) => (
          <div
            key={material.name}
            className={cn(
              'h-full transition-all',
              getColorForMaterial(material),
              index > 0 && 'border-l border-background'
            )}
            style={{ width: `${material.percentage}%` }}
            title={`${material.name}: ${material.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {materials.map((material) => (
          <div key={material.name} className="flex items-center gap-1">
            <div
              className={cn('w-2 h-2', getColorForMaterial(material))}
            />
            <span className="font-mono text-xs text-foreground-muted">
              {material.name} ({material.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { MaterialBreakdown }
