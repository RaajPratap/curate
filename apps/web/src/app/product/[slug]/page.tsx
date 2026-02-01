'use client'

import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { ProductDetail, ProductGrid, Product } from '@/components/product'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToCart, selectCartCount } from '@/store/slices/cartSlice'
import { mockProducts } from '@/lib/mock-data'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(selectCartCount)

  // Find product by slug (in real app, this would be fetched from API)
  const product = mockProducts.find((p) => p.slug === slug)

  // Get related products (same category, excluding current)
  const relatedProducts = mockProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    dispatch(addToCart({ product, size, quantity }))
  }

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes?.[0] || ''
    dispatch(addToCart({ product, size: defaultSize, quantity: 1 }))
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header cartCount={cartCount} />
        <section className="py-24">
          <Container>
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold tracking-tighter mb-4">
                Product Not Found
              </h1>
              <p className="font-mono text-foreground-muted uppercase tracking-wider">
                The product you're looking for doesn't exist.
              </p>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Breadcrumb */}
      <section className="border-b border-border py-4">
        <Container>
          <nav className="font-mono text-xs uppercase tracking-wider">
            <a href="/" className="text-foreground-muted hover:text-accent transition-colors">
              Home
            </a>
            <span className="mx-2 text-foreground-muted">/</span>
            <a href="/shop" className="text-foreground-muted hover:text-accent transition-colors">
              Shop
            </a>
            <span className="mx-2 text-foreground-muted">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </Container>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <Container>
          <ProductDetail product={product} onAddToCart={handleAddToCart} />
        </Container>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-border">
          <Container>
            <h2 className="font-display text-2xl font-bold tracking-tighter mb-8">
              YOU MAY ALSO LIKE
            </h2>
            <ProductGrid
              products={relatedProducts}
              columns={4}
              onQuickAdd={handleQuickAdd}
            />
          </Container>
        </section>
      )}

      <Footer />
    </main>
  )
}
