'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Badge, Button } from '@/components/ui'
import { cn, formatPrice, getEcoRatingColor } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  colors?: string[]
  sizes?: string[]
  sustainability: {
    ecoRating: 'A' | 'B' | 'C' | 'D' | 'F'
    carbonFootprint: number
    materials: { name: string; percentage: number }[]
    certifications: string[]
  }
  isNew?: boolean
  isSoldOut?: boolean
  isLimitedEdition?: boolean
}

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured'
  onQuickAdd?: (product: Product) => void
}

const ProductCard = ({ product, variant = 'default', onQuickAdd }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false)
  const {
    name,
    slug,
    price,
    compareAtPrice,
    images,
    colors,
    sustainability,
    isNew,
    isSoldOut,
    isLimitedEdition,
  } = product

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null

  // Placeholder component for missing images
  const ImagePlaceholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background-secondary">
      <div className="w-16 h-16 border border-border flex items-center justify-center mb-2">
        <span className="text-2xl">👕</span>
      </div>
      <span className="font-mono text-foreground-muted text-xs uppercase">{name}</span>
    </div>
  )

  return (
    <div className="product-card card group cursor-pointer">
      <Link href={`/product/${slug}`}>
        {/* Image Container */}
        <div
          className={cn(
            'relative bg-background-tertiary overflow-hidden',
            variant === 'featured' ? 'aspect-[4/5]' : 'aspect-[3/4]'
          )}
        >
          {/* Product Image */}
          {images[0] && !imageError ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {/* Eco Rating */}
            <Badge variant={getEcoRatingColor(sustainability.ecoRating) as any} size="sm">
              {sustainability.ecoRating}
            </Badge>

            {/* Status Badges */}
            {isNew && (
              <Badge variant="accent" size="sm">
                New
              </Badge>
            )}
            {isLimitedEdition && (
              <Badge variant="warning" size="sm">
                Limited
              </Badge>
            )}
            {discount && (
              <Badge variant="error" size="sm">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-mono text-sm uppercase tracking-widest">Sold Out</span>
            </div>
          )}

          {/* Quick Add Overlay */}
          {!isSoldOut && onQuickAdd && (
            <div className="product-card-overlay">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  onQuickAdd(product)
                }}
              >
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={cn('p-4', variant === 'compact' && 'p-3')}>
          <h3
            className={cn(
              'font-display font-semibold mb-1 group-hover:text-accent transition-colors',
              variant === 'featured' ? 'text-lg' : 'text-base'
            )}
          >
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-accent">{formatPrice(price)}</span>
              {compareAtPrice && (
                <span className="font-mono text-sm text-foreground-muted line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>

            {colors && colors.length > 1 && (
              <span className="font-mono text-xs text-foreground-muted">
                {colors.length} colors
              </span>
            )}
          </div>

          {/* Carbon Footprint */}
          {variant === 'featured' && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="font-mono text-xs text-foreground-muted">
                {sustainability.carbonFootprint} kg CO₂
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export { ProductCard }
