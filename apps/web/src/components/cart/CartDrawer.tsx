'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartCarbonFootprint,
  removeFromCart,
  updateQuantity,
  closeCart,
} from '@/store/slices/cartSlice'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
}

export function CartDrawer({ isOpen }: CartDrawerProps) {
  const dispatch = useAppDispatch()
  const drawerRef = useRef<HTMLDivElement>(null)
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)
  const carbonFootprint = useAppSelector(selectCartCarbonFootprint)

  const shippingThreshold = 2999
  const shippingCost = cartTotal >= shippingThreshold ? 0 : 199
  const amountToFreeShipping = shippingThreshold - cartTotal

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeCart())
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, dispatch])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close drawer when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(closeCart())
    }
  }

  const handleRemoveItem = (productId: string, size: string) => {
    dispatch(removeFromCart({ productId, size }))
  }

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    dispatch(updateQuantity({ productId, size, quantity }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold tracking-tighter">CART</h2>
              {cartCount > 0 && (
                <span className="font-mono text-xs bg-accent text-black px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="w-10 h-10 border border-border hover:border-accent transition-colors flex items-center justify-center"
              aria-label="Close cart"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Free shipping progress */}
          {cartItems.length > 0 && (
            <div className="p-4 border-b border-border bg-background-secondary">
              {cartTotal >= shippingThreshold ? (
                <div className="flex items-center gap-2 text-eco-green">
                  <span>✓</span>
                  <span className="font-mono text-sm">You've unlocked free shipping!</span>
                </div>
              ) : (
                <>
                  <p className="font-mono text-xs text-foreground-muted mb-2">
                    Add {formatPrice(amountToFreeShipping)} more for free shipping
                  </p>
                  <div className="h-1 bg-background-tertiary">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${Math.min((cartTotal / shippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 border border-border flex items-center justify-center mb-4">
                  <span className="text-3xl">🛒</span>
                </div>
                <p className="font-mono text-foreground-muted mb-4">Your cart is empty</p>
                <Link href="/shop" onClick={() => dispatch(closeCart())}>
                  <Button variant="brutal" size="sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 pb-4 border-b border-border"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-24 bg-background-secondary border border-border flex-shrink-0 flex items-center justify-center">
                      <span className="font-mono text-xs text-foreground-muted">IMG</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-mono text-sm font-semibold hover:text-accent transition-colors truncate pr-2"
                          onClick={() => dispatch(closeCart())}
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => handleRemoveItem(item.product.id, item.size)}
                          className="text-foreground-muted hover:text-error transition-colors text-lg leading-none"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </div>

                      <p className="font-mono text-xs text-foreground-muted mb-2">
                        Size: {item.size}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.product.id, item.size, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-background-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-mono text-sm border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.product.id, item.size, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-background-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-mono text-sm font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      {/* Eco badge */}
                      <div className="mt-2">
                        <span
                          className={`font-mono text-xs px-1 py-0.5 eco-badge-${item.product.sustainability.ecoRating.toLowerCase()}`}
                        >
                          ECO {item.product.sustainability.ecoRating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              {/* Carbon footprint */}
              <div className="flex items-center justify-between p-3 border border-eco-green bg-eco-green/5">
                <div className="flex items-center gap-2">
                  <span>🌍</span>
                  <span className="font-mono text-xs">Carbon Footprint</span>
                </div>
                <span className="font-mono text-xs text-eco-green">
                  {carbonFootprint.toFixed(1)} kg CO₂ (100% offset)
                </span>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-foreground-muted">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-foreground-muted">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-mono text-base pt-2 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-bold text-accent">
                    {formatPrice(cartTotal + shippingCost)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={() => dispatch(closeCart())}>
                  <Button variant="brutal" className="w-full">
                    Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => dispatch(closeCart())}>
                  <Button variant="secondary" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
