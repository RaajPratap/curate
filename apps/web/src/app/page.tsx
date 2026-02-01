'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { ProductGrid, Product } from '@/components/product'
import { Button } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToCart, selectCartCount } from '@/store/slices/cartSlice'
import { mockProducts } from '@/lib/mock-data'

export default function Home() {
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(selectCartCount)

  // Get featured products (new arrivals)
  const featuredProducts = mockProducts.filter((p) => p.isNew).slice(0, 4)
  const allFeatured = featuredProducts.length < 4 
    ? [...featuredProducts, ...mockProducts.filter((p) => !p.isNew).slice(0, 4 - featuredProducts.length)]
    : featuredProducts

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes?.[0] || ''
    dispatch(addToCart({ product, size: defaultSize, quantity: 1 }))
  }

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center border-b border-border grid-overlay">
        <Container className="text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            SUSTAINABLE
            <br />
            <span className="text-stroke-accent">STREETWEAR</span>
          </h1>
          
          <p className="font-mono text-foreground-secondary text-sm md:text-base uppercase tracking-wider mb-8 max-w-xl mx-auto">
            Fashion that doesn't cost the earth. 
            <br />
            Every piece tells a story of conscious creation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="brutal">Shop Now</Button>
            </Link>
            <Link href="/sustainability">
              <Button variant="secondary">Our Impact</Button>
            </Link>
          </div>

          {/* Sustainability Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="border border-border p-4">
              <div className="font-display text-3xl font-bold text-accent">67%</div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">Less Carbon</div>
            </div>
            <div className="border border-border p-4">
              <div className="font-display text-3xl font-bold text-accent">100%</div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">Recyclable</div>
            </div>
            <div className="border border-border p-4">
              <div className="font-display text-3xl font-bold text-accent">0</div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">Plastic Packaging</div>
            </div>
            <div className="border border-border p-4">
              <div className="font-display text-3xl font-bold text-accent">Fair</div>
              <div className="font-mono text-xs uppercase tracking-wider text-foreground-muted">Trade Certified</div>
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground-muted flex justify-center">
            <div className="w-1 h-3 bg-accent mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 border-b border-border">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tighter">
              NEW ARRIVALS
            </h2>
            <Link href="/shop" className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors">
              View All →
            </Link>
          </div>

          <ProductGrid
            products={allFeatured}
            columns={4}
            onQuickAdd={handleQuickAdd}
          />
        </Container>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-background-secondary border-b border-border">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                Our Promise
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                FASHION WITH
                <br />
                <span className="text-accent">CONSCIENCE</span>
              </h2>
              <p className="font-body text-foreground-secondary mb-6">
                Every piece in our collection is designed with the planet in mind. 
                From organic materials to carbon-neutral shipping, we're committed 
                to revolutionizing streetwear.
              </p>
              <Link href="/sustainability">
                <Button variant="primary">Learn More</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-accent p-6">
                <div className="w-12 h-12 border border-accent flex items-center justify-center mb-4">
                  <span className="text-accent text-2xl">&#127793;</span>
                </div>
                <h3 className="font-display font-bold mb-2">Organic Materials</h3>
                <p className="font-mono text-xs text-foreground-muted">
                  100% organic cotton and recycled polyester
                </p>
              </div>
              <div className="border border-border p-6">
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-4">
                  <span className="text-2xl">&#9851;</span>
                </div>
                <h3 className="font-display font-bold mb-2">Circular Design</h3>
                <p className="font-mono text-xs text-foreground-muted">
                  Made to be recycled at end of life
                </p>
              </div>
              <div className="border border-border p-6">
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-4">
                  <span className="text-2xl">&#127981;</span>
                </div>
                <h3 className="font-display font-bold mb-2">Fair Trade</h3>
                <p className="font-mono text-xs text-foreground-muted">
                  Ethical factories with living wages
                </p>
              </div>
              <div className="border border-border p-6">
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-4">
                  <span className="text-2xl">&#128230;</span>
                </div>
                <h3 className="font-display font-bold mb-2">Zero Plastic</h3>
                <p className="font-mono text-xs text-foreground-muted">
                  Plastic-free, compostable packaging
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
