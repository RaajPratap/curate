'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  carbonFootprint: number
  itemCount: number
}

const CartSummary = ({ subtotal, carbonFootprint, itemCount }: CartSummaryProps) => {
  const freeShippingThreshold = 2999
  const shipping = subtotal >= freeShippingThreshold ? 0 : 199
  const total = subtotal + shipping

  // Calculate estimated carbon savings vs industry average
  const industryAverageCarbonPerItem = 15 // kg CO₂
  const carbonSaved = Math.max(0, industryAverageCarbonPerItem * itemCount - carbonFootprint)

  return (
    <div className="border border-border p-6 space-y-6">
      <h3 className="font-display text-xl font-bold tracking-tighter">
        ORDER SUMMARY
      </h3>

      {/* Line Items */}
      <div className="space-y-3">
        <div className="flex justify-between font-mono text-sm">
          <span className="text-foreground-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-mono text-sm">
          <span className="text-foreground-muted">Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="font-mono text-xs text-accent">
            Add {formatPrice(freeShippingThreshold - subtotal)} more for free shipping
          </p>
        )}
      </div>

      {/* Carbon Impact */}
      <div className="border-t border-b border-border py-4 space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
          Environmental Impact
        </p>
        <div className="flex justify-between font-mono text-sm">
          <span>Total Carbon Footprint</span>
          <span className="text-accent">{carbonFootprint.toFixed(1)} kg CO₂</span>
        </div>
        {carbonSaved > 0 && (
          <div className="flex justify-between font-mono text-sm">
            <span>Carbon Saved vs Avg</span>
            <span className="text-eco-green">-{carbonSaved.toFixed(1)} kg CO₂</span>
          </div>
        )}
      </div>

      {/* Carbon Offset Option */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 accent-accent"
        />
        <div>
          <span className="font-mono text-sm">Offset remaining carbon</span>
          <p className="font-mono text-xs text-foreground-muted">
            +{formatPrice(49)} to plant trees and offset your order's footprint
          </p>
        </div>
      </label>

      {/* Total */}
      <div className="flex justify-between font-display text-xl font-bold border-t border-border pt-4">
        <span>Total</span>
        <span className="text-accent">{formatPrice(total)}</span>
      </div>

      {/* Checkout Button */}
      <Button variant="brutal" size="lg" className="w-full">
        Checkout
      </Button>

      {/* Continue Shopping */}
      <Link
        href="/shop"
        className="block text-center font-mono text-sm uppercase tracking-wider text-foreground-muted hover:text-accent transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Trust Badges */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-center gap-4 font-mono text-xs text-foreground-muted">
          <span>Secure Checkout</span>
          <span>•</span>
          <span>Free Returns</span>
          <span>•</span>
          <span>Carbon Neutral</span>
        </div>
      </div>
    </div>
  )
}

export { CartSummary }
