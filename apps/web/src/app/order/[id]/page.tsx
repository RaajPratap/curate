'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { ImpactStats } from '@/components/sustainability'
import { formatPrice } from '@/lib/utils'

// Mock order data - in production this would be fetched from API
const generateMockOrder = (orderId: string) => ({
  id: orderId,
  orderNumber: orderId,
  status: 'confirmed',
  date: new Date().toISOString(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  items: [
    {
      id: '1',
      name: 'Recycled Cotton Hoodie',
      size: 'M',
      quantity: 1,
      price: 4999,
      image: '/products/hoodie.jpg',
    },
    {
      id: '2',
      name: 'Organic Basics Tee',
      size: 'L',
      quantity: 2,
      price: 1499,
      image: '/products/tee.jpg',
    },
  ],
  subtotal: 7997,
  shipping: 0,
  total: 7997,
  carbonFootprint: 5.2,
  carbonOffset: 5.2,
  shippingAddress: {
    name: 'Demo User',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  paymentMethod: 'Credit Card ending in 4242',
})

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<ReturnType<typeof generateMockOrder> | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Simulate fetching order
    setOrder(generateMockOrder(orderId))
    
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [orderId])

  if (!order) {
    return (
      <main className="min-h-screen">
        <Header cartCount={0} />
        <section className="py-24">
          <Container>
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-background-secondary w-64 mx-auto mb-4" />
                <div className="h-4 bg-background-secondary w-48 mx-auto" />
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Simple celebration effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-accent animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-eco-green animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      )}

      <Header cartCount={0} />

      <section className="py-12">
        <Container>
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-accent mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              ORDER CONFIRMED
            </h1>
            <p className="font-mono text-foreground-muted max-w-md mx-auto">
              Thank you for your purchase! We've sent a confirmation email with your order details.
            </p>
          </div>

          {/* Order Number */}
          <div className="text-center mb-12 p-6 border border-accent bg-accent/5">
            <p className="font-mono text-sm text-foreground-muted uppercase tracking-wider mb-2">
              Order Number
            </p>
            <p className="font-display text-2xl font-bold text-accent">{order.orderNumber}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Order Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-bold tracking-tighter mb-6">
                  ORDER DETAILS
                </h3>

                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-background-secondary border border-border flex-shrink-0 flex items-center justify-center">
                        <span className="font-mono text-xs text-foreground-muted">IMG</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-sm font-semibold">{item.name}</p>
                        <p className="font-mono text-xs text-foreground-muted">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-mono text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-foreground-muted">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-foreground-muted">Shipping</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm pt-2 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="font-display text-xl font-bold text-accent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Payment Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-bold tracking-tighter mb-4">
                    SHIPPING ADDRESS
                  </h3>
                  <div className="font-mono text-sm space-y-1">
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-foreground-muted">{order.shippingAddress.address}</p>
                    <p className="text-foreground-muted">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-bold tracking-tighter mb-4">
                    ESTIMATED DELIVERY
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-accent flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="font-mono text-xs text-foreground-muted">
                        Carbon neutral shipping
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-bold tracking-tighter mb-4">
                    PAYMENT METHOD
                  </h3>
                  <p className="font-mono text-sm">{order.paymentMethod}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Environmental Impact */}
          <Card className="border-eco-green mb-12">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🌍</span>
                <h3 className="font-display text-xl font-bold tracking-tighter text-eco-green">
                  YOUR ENVIRONMENTAL IMPACT
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 border border-eco-green/30">
                  <p className="font-display text-3xl font-bold text-eco-green">
                    {order.carbonFootprint.toFixed(1)} kg
                  </p>
                  <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                    Carbon Footprint
                  </p>
                </div>
                <div className="text-center p-4 border border-eco-green/30">
                  <p className="font-display text-3xl font-bold text-eco-green">
                    {order.carbonOffset.toFixed(1)} kg
                  </p>
                  <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                    Carbon Offset
                  </p>
                </div>
                <div className="text-center p-4 border border-accent">
                  <p className="font-display text-3xl font-bold text-accent">100%</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                    Net Zero Order
                  </p>
                </div>
              </div>

              <p className="font-mono text-sm text-foreground-muted text-center">
                We're planting trees through our partner reforestation projects to offset the carbon 
                footprint of your order. You'll receive a certificate via email.
              </p>
            </CardContent>
          </Card>

          {/* What's Next */}
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold tracking-tighter mb-6">
              WHAT'S NEXT?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 border border-border">
                <div className="w-12 h-12 border border-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📧</span>
                </div>
                <h4 className="font-mono text-sm font-semibold mb-2">Confirmation Email</h4>
                <p className="font-mono text-xs text-foreground-muted">
                  Check your inbox for order confirmation and tracking details
                </p>
              </div>
              <div className="p-6 border border-border">
                <div className="w-12 h-12 border border-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🚚</span>
                </div>
                <h4 className="font-mono text-sm font-semibold mb-2">Shipping Updates</h4>
                <p className="font-mono text-xs text-foreground-muted">
                  We'll notify you when your order ships and provide tracking
                </p>
              </div>
              <div className="p-6 border border-border">
                <div className="w-12 h-12 border border-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🌱</span>
                </div>
                <h4 className="font-mono text-sm font-semibold mb-2">Impact Certificate</h4>
                <p className="font-mono text-xs text-foreground-muted">
                  Receive your carbon offset certificate within 24 hours
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account">
                <Button variant="secondary">View Order Status</Button>
              </Link>
              <Link href="/shop">
                <Button variant="brutal">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
