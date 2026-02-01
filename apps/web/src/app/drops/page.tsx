'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { EcoBadge } from '@/components/sustainability'
import { useAppSelector } from '@/store/hooks'
import { selectCartCount } from '@/store/slices/cartSlice'
import { formatPrice } from '@/lib/utils'

interface Drop {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  releaseDate: string
  endDate?: string
  status: 'upcoming' | 'live' | 'sold_out' | 'ended'
  totalQuantity: number
  remaining: number
  ecoRating: 'A' | 'B' | 'C' | 'D' | 'F'
  collaboration?: string
  materials: string[]
}

const drops: Drop[] = [
  {
    id: 'drop-1',
    name: 'OCEAN RECLAIM COLLECTION',
    description:
      'Limited edition pieces made entirely from ocean plastic. Each garment removes 2kg of plastic from our oceans.',
    price: 8999,
    image: '/drops/ocean-reclaim.jpg',
    releaseDate: '2026-02-05T10:00:00+05:30',
    status: 'upcoming',
    totalQuantity: 200,
    remaining: 200,
    ecoRating: 'A',
    collaboration: 'Ocean Conservancy',
    materials: ['100% Recycled Ocean Plastic', 'Plant-based dyes'],
  },
  {
    id: 'drop-2',
    name: 'ZERO WASTE HOODIE',
    description:
      'Engineered with zero textile waste. Every scrap is reused. Bold oversized fit with signature brutalist details.',
    price: 6999,
    originalPrice: 8999,
    image: '/drops/zero-waste.jpg',
    releaseDate: '2026-01-28T10:00:00+05:30',
    endDate: '2026-02-10T23:59:59+05:30',
    status: 'live',
    totalQuantity: 150,
    remaining: 47,
    ecoRating: 'A',
    materials: ['Recycled Cotton', 'Hemp blend', 'Zero-waste production'],
  },
  {
    id: 'drop-3',
    name: 'ARTIST SERIES: BANGALORE',
    description:
      'Collaboration with local Bangalore street artists. Hand-printed using eco-friendly water-based inks.',
    price: 4499,
    image: '/drops/artist-series.jpg',
    releaseDate: '2026-02-14T10:00:00+05:30',
    status: 'upcoming',
    totalQuantity: 100,
    remaining: 100,
    ecoRating: 'A',
    collaboration: 'Bangalore Street Art Collective',
    materials: ['Organic Cotton', 'Water-based inks'],
  },
  {
    id: 'drop-4',
    name: 'VINTAGE DEADSTOCK JACKET',
    description:
      'Upcycled from vintage deadstock military surplus. Each piece is unique with its own history.',
    price: 11999,
    image: '/drops/vintage-jacket.jpg',
    releaseDate: '2026-01-15T10:00:00+05:30',
    status: 'sold_out',
    totalQuantity: 50,
    remaining: 0,
    ecoRating: 'A',
    materials: ['Vintage deadstock', 'Upcycled hardware'],
  },
  {
    id: 'drop-5',
    name: 'HEMP BASICS PACK',
    description:
      'Essential tees in a sustainable 3-pack. Carbon negative production, incredibly soft hemp blend.',
    price: 3999,
    originalPrice: 4497,
    image: '/drops/hemp-basics.jpg',
    releaseDate: '2026-01-20T10:00:00+05:30',
    endDate: '2026-02-28T23:59:59+05:30',
    status: 'live',
    totalQuantity: 500,
    remaining: 312,
    ecoRating: 'A',
    materials: ['55% Hemp', '45% Organic Cotton'],
  },
]

function CountdownTimer({ targetDate, label }: { targetDate: string; label: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div>
      <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex gap-2">
        {[
          { value: timeLeft.days, label: 'D' },
          { value: timeLeft.hours, label: 'H' },
          { value: timeLeft.minutes, label: 'M' },
          { value: timeLeft.seconds, label: 'S' },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 border border-accent bg-accent/10 flex items-center justify-center">
              <span className="font-display text-xl font-bold text-accent">
                {item.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="font-mono text-xs text-foreground-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressBar({ remaining, total }: { remaining: number; total: number }) {
  const percentage = ((total - remaining) / total) * 100

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-xs text-foreground-muted">
          {remaining} / {total} remaining
        </span>
        <span className="font-mono text-xs text-accent">{Math.round(percentage)}% claimed</span>
      </div>
      <div className="h-2 bg-background-tertiary">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function DropCard({ drop }: { drop: Drop }) {
  const statusConfig = {
    upcoming: { label: 'Coming Soon', variant: 'warning' as const },
    live: { label: 'Live Now', variant: 'success' as const },
    sold_out: { label: 'Sold Out', variant: 'error' as const },
    ended: { label: 'Ended', variant: 'default' as const },
  }

  const { label, variant } = statusConfig[drop.status]

  return (
    <Card className={drop.status === 'live' ? 'border-accent' : ''}>
      <CardContent className="p-0">
        {/* Image placeholder */}
        <div className="relative h-64 bg-background-secondary border-b border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-foreground-muted">DROP IMAGE</span>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={variant}>{label}</Badge>
            <EcoBadge rating={drop.ecoRating} size="sm" />
          </div>
          {drop.collaboration && (
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-mono text-xs bg-black/80 px-2 py-1">
                Collab: {drop.collaboration}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-bold tracking-tighter mb-2">{drop.name}</h3>
          <p className="font-mono text-sm text-foreground-muted mb-4 line-clamp-2">
            {drop.description}
          </p>

          {/* Materials */}
          <div className="flex flex-wrap gap-2 mb-4">
            {drop.materials.map((material) => (
              <span
                key={material}
                className="font-mono text-xs px-2 py-1 border border-border bg-background-secondary"
              >
                {material}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-2xl font-bold text-accent">
              {formatPrice(drop.price)}
            </span>
            {drop.originalPrice && (
              <span className="font-mono text-sm text-foreground-muted line-through">
                {formatPrice(drop.originalPrice)}
              </span>
            )}
          </div>

          {/* Progress bar for live drops */}
          {drop.status === 'live' && (
            <div className="mb-4">
              <ProgressBar remaining={drop.remaining} total={drop.totalQuantity} />
            </div>
          )}

          {/* Countdown or action */}
          {drop.status === 'upcoming' && (
            <div className="mb-4">
              <CountdownTimer targetDate={drop.releaseDate} label="Drops in" />
            </div>
          )}

          {drop.status === 'live' && drop.endDate && (
            <div className="mb-4">
              <CountdownTimer targetDate={drop.endDate} label="Ends in" />
            </div>
          )}

          {/* CTA */}
          {drop.status === 'upcoming' && (
            <Button variant="secondary" className="w-full">
              Notify Me
            </Button>
          )}
          {drop.status === 'live' && (
            <Link href={`/product/${drop.id}`}>
              <Button variant="brutal" className="w-full">
                Shop Now
              </Button>
            </Link>
          )}
          {drop.status === 'sold_out' && (
            <Button variant="secondary" className="w-full" disabled>
              Sold Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DropsPage() {
  const cartCount = useAppSelector(selectCartCount)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'past'>('all')

  const filteredDrops = drops.filter((drop) => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return drop.status === 'upcoming'
    if (filter === 'live') return drop.status === 'live'
    if (filter === 'past') return drop.status === 'sold_out' || drop.status === 'ended'
    return true
  })

  const liveDrops = drops.filter((d) => d.status === 'live')
  const upcomingDrops = drops.filter((d) => d.status === 'upcoming')

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Hero */}
      <section className="py-16 border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-4">
              Limited Editions
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tighter mb-4">
              EXCLUSIVE
              <br />
              <span className="text-accent">DROPS</span>
            </h1>
            <p className="font-mono text-lg text-foreground-muted">
              Limited quantities. Unique designs. Sustainable production. 
              Once they're gone, they're gone.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-8 bg-background-secondary border-b border-border">
        <Container>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <span className="font-display text-3xl font-bold text-accent">{liveDrops.length}</span>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Live Now
              </p>
            </div>
            <div className="text-center">
              <span className="font-display text-3xl font-bold">{upcomingDrops.length}</span>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Coming Soon
              </p>
            </div>
            <div className="text-center">
              <span className="font-display text-3xl font-bold">
                {liveDrops.reduce((acc, d) => acc + d.remaining, 0)}
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Items Available
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <Container>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Drops' },
              { id: 'live', label: 'Live Now' },
              { id: 'upcoming', label: 'Coming Soon' },
              { id: 'past', label: 'Past Drops' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`font-mono text-sm uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap ${
                  filter === f.id
                    ? 'border-accent bg-accent text-black'
                    : 'border-border hover:border-foreground-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Live Drop */}
      {liveDrops.length > 0 && filter !== 'upcoming' && filter !== 'past' && (
        <section className="py-12 bg-accent/5 border-b border-accent">
          <Container>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-accent animate-pulse" />
              <span className="font-mono text-sm uppercase tracking-wider text-accent">
                Featured Drop - Live Now
              </span>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="h-80 bg-background-secondary border border-border flex items-center justify-center">
                <span className="font-mono text-foreground-muted">FEATURED DROP IMAGE</span>
              </div>
              <div>
                <div className="mb-4">
                  <EcoBadge rating={liveDrops[0].ecoRating} size="lg" />
                </div>
                <h2 className="font-display text-4xl font-bold tracking-tighter mb-4">
                  {liveDrops[0].name}
                </h2>
                <p className="font-mono text-foreground-muted mb-6">{liveDrops[0].description}</p>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-display text-4xl font-bold text-accent">
                    {formatPrice(liveDrops[0].price)}
                  </span>
                  {liveDrops[0].originalPrice && (
                    <span className="font-mono text-lg text-foreground-muted line-through">
                      {formatPrice(liveDrops[0].originalPrice)}
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <ProgressBar remaining={liveDrops[0].remaining} total={liveDrops[0].totalQuantity} />
                </div>
                {liveDrops[0].endDate && (
                  <div className="mb-6">
                    <CountdownTimer targetDate={liveDrops[0].endDate} label="Ends in" />
                  </div>
                )}
                <Link href={`/product/${liveDrops[0].id}`}>
                  <Button variant="brutal" size="lg">
                    Shop This Drop
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* All Drops Grid */}
      <section className="py-12">
        <Container>
          {filteredDrops.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-mono text-foreground-muted mb-4">No drops found</p>
              <Button variant="secondary" onClick={() => setFilter('all')}>
                View All Drops
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrops.map((drop) => (
                <DropCard key={drop.id} drop={drop} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-background-secondary border-t border-border">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold tracking-tighter mb-4">
              NEVER MISS A DROP
            </h2>
            <p className="font-mono text-foreground-muted mb-6">
              Get early access and notifications for upcoming limited editions. 
              Members get 10 minute head start on all drops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="input max-w-sm"
              />
              <Button variant="brutal">Get Notified</Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
