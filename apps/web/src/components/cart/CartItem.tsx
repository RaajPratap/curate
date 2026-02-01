'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/components/product'
import { Badge } from '@/components/ui'
import { formatPrice, getEcoRatingColor } from '@/lib/utils'

interface CartItemProps {
  product: Product
  size: string
  quantity: number
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

const CartItem = ({ product, size, quantity, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { name, slug, price, images, sustainability } = product

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      {/* Image */}
      <Link href={`/product/${slug}`} className="flex-shrink-0">
        <div className="w-24 h-32 bg-background-tertiary relative">
          {images[0] ? (
            <Image src={images[0]} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-foreground-muted text-xs">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/product/${slug}`}
              className="font-display font-semibold hover:text-accent transition-colors"
            >
              {name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-foreground-muted uppercase">
                Size: {size}
              </span>
              <Badge variant={getEcoRatingColor(sustainability.ecoRating) as any} size="sm">
                {sustainability.ecoRating}
              </Badge>
            </div>
          </div>
          <span className="font-mono text-accent">{formatPrice(price * quantity)}</span>
        </div>

        {/* Carbon footprint */}
        <p className="font-mono text-xs text-foreground-muted mt-2">
          {(sustainability.carbonFootprint * quantity).toFixed(1)} kg CO₂
        </p>

        {/* Quantity & Remove */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 font-mono text-sm hover:bg-background-hover transition-colors"
            >
              -
            </button>
            <span className="w-8 h-8 flex items-center justify-center font-mono text-sm border-x border-border">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-8 h-8 font-mono text-sm hover:bg-background-hover transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="font-mono text-xs uppercase tracking-wider text-foreground-muted hover:text-error transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export { CartItem }
