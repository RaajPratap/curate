'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from './ProductCard'
import { Badge, Button, Select } from '@/components/ui'
import { cn, formatPrice, getEcoRatingColor } from '@/lib/utils'

interface ProductDetailProps {
  product: Product
  onAddToCart?: (product: Product, size: string, quantity: number) => void
}

const ProductDetail = ({ product, onAddToCart }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const {
    name,
    price,
    compareAtPrice,
    images,
    sustainability,
    sizes,
    colors,
    isNew,
    isSoldOut,
    isLimitedEdition,
  } = product

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null

  const handleAddToCart = () => {
    if (!selectedSize && sizes && sizes.length > 0) {
      return // Show error
    }
    onAddToCart?.(product, selectedSize, quantity)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-[3/4] bg-background-tertiary relative">
          {images[selectedImage] ? (
            <Image
              src={images[selectedImage]}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-foreground-muted text-sm uppercase">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge variant={getEcoRatingColor(sustainability.ecoRating) as any}>
              ECO {sustainability.ecoRating}
            </Badge>
            {isNew && <Badge variant="accent">New</Badge>}
            {isLimitedEdition && <Badge variant="warning">Limited Edition</Badge>}
            {discount && <Badge variant="error">-{discount}%</Badge>}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'aspect-square bg-background-tertiary relative border-2 transition-colors',
                  selectedImage === index ? 'border-accent' : 'border-transparent hover:border-border'
                )}
              >
                <Image src={image} alt={`${name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-2">
            {name}
          </h1>

          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl text-accent">{formatPrice(price)}</span>
            {compareAtPrice && (
              <span className="font-mono text-lg text-foreground-muted line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Sustainability Info */}
        <div className="border border-accent p-4 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
            Sustainability Score
          </h3>

          <div className="flex items-center gap-4">
            <div className="text-4xl font-display font-bold text-accent">
              {sustainability.ecoRating}
            </div>
            <div>
              <p className="font-mono text-sm">
                {sustainability.carbonFootprint} kg CO₂ footprint
              </p>
              <p className="font-mono text-xs text-foreground-muted">
                {sustainability.certifications.join(' • ')}
              </p>
            </div>
          </div>

          {/* Materials */}
          <div className="pt-2 border-t border-border">
            <p className="font-mono text-xs text-foreground-muted mb-2">MATERIALS</p>
            <div className="space-y-1">
              {sustainability.materials.map((material) => (
                <div key={material.name} className="flex items-center justify-between">
                  <span className="font-mono text-sm">{material.name}</span>
                  <span className="font-mono text-sm text-accent">{material.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Size Selection */}
        {sizes && sizes.length > 0 && (
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground-secondary mb-2">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'w-12 h-12 border-2 font-mono text-sm uppercase transition-colors',
                    selectedSize === size
                      ? 'border-accent bg-accent text-black'
                      : 'border-border hover:border-white'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Info */}
        {colors && colors.length > 0 && (
          <div>
            <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider">
              Color: <span className="text-white">{colors[0]}</span>
            </p>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-foreground-secondary mb-2">
            Quantity
          </label>
          <div className="flex items-center border border-border w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 font-mono text-lg hover:bg-background-hover transition-colors"
            >
              -
            </button>
            <span className="w-12 h-12 flex items-center justify-center font-mono border-x border-border">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 font-mono text-lg hover:bg-background-hover transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="space-y-3">
          <Button
            variant="brutal"
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </Button>

          <Button variant="secondary" size="lg" className="w-full">
            Save for Later
          </Button>
        </div>

        {/* Additional Info */}
        <div className="border-t border-border pt-6 space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-mono text-sm uppercase tracking-wider">
              Description
              <span className="text-accent group-open:rotate-180 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-foreground-secondary">
              Premium sustainable streetwear crafted with care for both style and planet. 
              This piece features our signature minimalist design with maximum impact.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-mono text-sm uppercase tracking-wider">
              Shipping & Returns
              <span className="text-accent group-open:rotate-180 transition-transform">+</span>
            </summary>
            <div className="mt-4 text-foreground-secondary space-y-2">
              <p>Free carbon-neutral shipping on orders over $100</p>
              <p>30-day returns with our recycling program</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-mono text-sm uppercase tracking-wider">
              Care Instructions
              <span className="text-accent group-open:rotate-180 transition-transform">+</span>
            </summary>
            <div className="mt-4 text-foreground-secondary space-y-2">
              <p>Machine wash cold with like colors</p>
              <p>Tumble dry low or hang dry</p>
              <p>Do not bleach</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export { ProductDetail }
