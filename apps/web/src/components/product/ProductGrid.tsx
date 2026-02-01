'use client'

import { ProductCard, Product } from './ProductCard'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'compact' | 'featured'
  onQuickAdd?: (product: Product) => void
  emptyMessage?: string
}

const ProductGrid = ({
  products,
  columns = 4,
  variant = 'default',
  onQuickAdd,
  emptyMessage = 'No products found',
}: ProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-mono text-foreground-muted uppercase tracking-wider">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns])}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  )
}

export { ProductGrid }
