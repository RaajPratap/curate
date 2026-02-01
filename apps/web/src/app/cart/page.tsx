'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { CartItem, CartSummary } from '@/components/cart'
import { Button } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartCarbonFootprint,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '@/store/slices/cartSlice'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const subtotal = useAppSelector(selectCartTotal)
  const carbonFootprint = useAppSelector(selectCartCarbonFootprint)

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    dispatch(updateQuantity({ productId, size, quantity }))
  }

  const handleRemove = (productId: string, size: string) => {
    dispatch(removeFromCart({ productId, size }))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Page Header */}
      <section className="border-b border-border py-12">
        <Container>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-2">
            YOUR CART
          </h1>
          <p className="font-mono text-foreground-muted text-sm uppercase tracking-wider">
            {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
          </p>
        </Container>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <Container>
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-24 h-24 border-2 border-border flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tighter mb-2">
                Your cart is empty
              </h2>
              <p className="font-mono text-foreground-muted text-sm uppercase tracking-wider mb-8">
                Looks like you haven't added anything yet
              </p>
              <Link href="/shop">
                <Button variant="brutal" size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
                    Cart Items
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="font-mono text-xs uppercase tracking-wider text-foreground-muted hover:text-error transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.size}`}
                      product={item.product}
                      size={item.size}
                      quantity={item.quantity}
                      onUpdateQuantity={(qty) =>
                        handleUpdateQuantity(item.product.id, item.size, qty)
                      }
                      onRemove={() => handleRemove(item.product.id, item.size)}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-32">
                  <CartSummary
                    subtotal={subtotal}
                    carbonFootprint={carbonFootprint}
                    itemCount={cartCount}
                  />
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  )
}
