'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { ImpactStats } from '@/components/sustainability'
import { ProtectedRoute } from '@/components/auth'
import { useAppSelector } from '@/store/hooks'
import { selectCartCount } from '@/store/slices/cartSlice'
import { useAuth } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'

// Mock order data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'CUR-2026-001234',
    date: '2026-01-28',
    status: 'delivered',
    total: 8498,
    items: [
      { name: 'Recycled Hoodie', size: 'M', quantity: 1, price: 4999 },
      { name: 'Organic Tee', size: 'L', quantity: 2, price: 1499 },
    ],
    carbonFootprint: 6.3,
  },
  {
    id: '2',
    orderNumber: 'CUR-2026-001198',
    date: '2026-01-15',
    status: 'delivered',
    total: 5999,
    items: [
      { name: 'Eco Cargo Pants', size: '32', quantity: 1, price: 5999 },
    ],
    carbonFootprint: 6.8,
  },
  {
    id: '3',
    orderNumber: 'CUR-2026-001156',
    date: '2026-01-02',
    status: 'delivered',
    total: 11999,
    items: [
      { name: 'Limited Drop Jacket', size: 'L', quantity: 1, price: 11999 },
    ],
    carbonFootprint: 8.5,
  },
]

const statusColors: Record<string, string> = {
  pending: 'warning',
  confirmed: 'accent',
  processing: 'accent',
  shipped: 'accent',
  delivered: 'success',
  cancelled: 'error',
}

export default function AccountPage() {
  const router = useRouter()
  const cartCount = useAppSelector(selectCartCount)
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'impact' | 'settings'>('orders')

  // Use authenticated user
  const displayUser = user || {
    name: 'User',
    email: '',
    sustainabilityImpact: {
      carbonSaved: 0,
      waterSaved: 0,
      ordersCount: 0,
    },
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const tabs = [
    { id: 'orders', label: 'Orders' },
    { id: 'impact', label: 'My Impact' },
    { id: 'settings', label: 'Settings' },
  ] as const

  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Header cartCount={cartCount} />

        <section className="py-12">
          <Container>
            {/* Account Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-8 border-b border-border">
              <div>
                <h1 className="font-display text-4xl font-bold tracking-tighter mb-1">
                  {displayUser.name.toUpperCase()}
                </h1>
                <p className="font-mono text-sm text-foreground-muted">{displayUser.email}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-border p-4">
              <div className="font-display text-2xl font-bold text-accent">
                {mockOrders.length}
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Orders
              </div>
            </div>
            <div className="border border-border p-4">
              <div className="font-display text-2xl font-bold text-accent">
                {displayUser.sustainabilityImpact.carbonSaved.toFixed(1)} kg
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                CO₂ Saved
              </div>
            </div>
            <div className="border border-border p-4">
              <div className="font-display text-2xl font-bold text-accent">
                {displayUser.sustainabilityImpact.waterSaved} L
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Water Saved
              </div>
            </div>
            <div className="border border-accent p-4">
              <div className="font-display text-2xl font-bold text-accent">
                ECO HERO
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Your Status
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-mono text-sm uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? 'text-accent border-accent'
                    : 'text-foreground-muted border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {mockOrders.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-mono text-foreground-muted uppercase tracking-wider mb-4">
                    No orders yet
                  </p>
                  <Link href="/shop">
                    <Button variant="brutal">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                mockOrders.map((order) => (
                  <Card key={order.id} variant="hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm">{order.orderNumber}</span>
                            <Badge variant={statusColors[order.status] as any}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="font-mono text-xs text-foreground-muted">
                            {new Date(order.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-xl font-bold text-accent">
                            {formatPrice(order.total)}
                          </div>
                          <p className="font-mono text-xs text-foreground-muted">
                            {order.carbonFootprint} kg CO₂
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between font-mono text-sm">
                              <span>
                                {item.name} ({item.size}) x{item.quantity}
                              </span>
                              <span className="text-foreground-muted">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          Track Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-8">
              <div className="border border-accent p-6">
                <h3 className="font-display text-xl font-bold tracking-tighter mb-6">
                  YOUR SUSTAINABILITY IMPACT
                </h3>
                <ImpactStats
                  carbonSaved={displayUser.sustainabilityImpact.carbonSaved}
                  waterSaved={displayUser.sustainabilityImpact.waterSaved}
                  ordersCount={displayUser.sustainabilityImpact.ordersCount}
                  variant="horizontal"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
                      Impact Breakdown
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-sm">Carbon Offset</span>
                          <span className="font-mono text-sm text-eco-green">100%</span>
                        </div>
                        <div className="h-2 bg-background-tertiary">
                          <div className="h-full bg-eco-green" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-sm">Recycled Materials</span>
                          <span className="font-mono text-sm text-accent">78%</span>
                        </div>
                        <div className="h-2 bg-background-tertiary">
                          <div className="h-full bg-accent" style={{ width: '78%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-sm">Water Savings</span>
                          <span className="font-mono text-sm text-info">65%</span>
                        </div>
                        <div className="h-2 bg-background-tertiary">
                          <div className="h-full bg-info" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
                      Achievements
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border border-accent bg-accent/5">
                        <span className="text-2xl">🌱</span>
                        <div>
                          <p className="font-mono text-sm font-semibold">First Order</p>
                          <p className="font-mono text-xs text-foreground-muted">Started your journey</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-accent bg-accent/5">
                        <span className="text-2xl">🌍</span>
                        <div>
                          <p className="font-mono text-sm font-semibold">Carbon Saver</p>
                          <p className="font-mono text-xs text-foreground-muted">Saved 20+ kg CO₂</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-border opacity-50">
                        <span className="text-2xl">💧</span>
                        <div>
                          <p className="font-mono text-sm font-semibold">Water Guardian</p>
                          <p className="font-mono text-xs text-foreground-muted">Save 5000L water</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-display text-lg font-bold mb-4">Profile Information</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-foreground-muted mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={displayUser.name}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-foreground-muted mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={displayUser.email}
                          className="input"
                        />
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-display text-lg font-bold mb-4">Saved Addresses</h4>
                  <div className="border border-border p-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-semibold">Home</p>
                        <p className="font-mono text-sm text-foreground-muted">
                          123 Main Street, Apartment 4B<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                      <Badge variant="accent">Default</Badge>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Add New Address
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-display text-lg font-bold mb-4">Preferences</h4>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent" />
                      <span className="font-mono text-sm">Email me about new drops</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent" />
                      <span className="font-mono text-sm">Sustainability updates</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-accent" />
                      <span className="font-mono text-sm">SMS notifications</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-display text-lg font-bold mb-4 text-error">Danger Zone</h4>
                  <p className="font-mono text-sm text-foreground-muted mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button variant="danger" size="sm">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
    </ProtectedRoute>
  )
}
