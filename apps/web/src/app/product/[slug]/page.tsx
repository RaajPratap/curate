"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { ProductDetail, ProductGrid, Product } from "@/components/product";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCartAsync, selectCartCount } from "@/store/slices/cartSlice";
import { productsService } from "@/lib/api/products";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product and related products from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await productsService.getProduct(slug);
        setProduct(fetchedProduct);

        // Fetch related products (all products for now, filter by category on client)
        if (fetchedProduct) {
          const result = await productsService.getProducts({ limit: 12 });
          const related = result.products
            .filter(
              (p) =>
                p.category === fetchedProduct.category &&
                p.id !== fetchedProduct.id,
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = (
    product: Product,
    size: string,
    quantity: number,
  ) => {
    dispatch(addToCartAsync({ product, size, quantity }));
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes?.[0] || "";
    dispatch(addToCartAsync({ product, size: defaultSize, quantity: 1 }));
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen">
        <Header cartCount={cartCount} />
        <section className="py-24">
          <Container>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-foreground-muted text-sm uppercase tracking-wider">
                  Loading product...
                </p>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen">
        <Header cartCount={cartCount} />
        <section className="py-24">
          <Container>
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold tracking-tighter mb-4">
                Error Loading Product
              </h1>
              <p className="font-mono text-red-500 uppercase tracking-wider mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="font-mono text-sm text-accent hover:underline"
              >
                Try Again
              </button>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    );
  }

  // Product not found
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
    );
  }

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Breadcrumb */}
      <section className="border-b border-border py-4">
        <Container>
          <nav className="font-mono text-xs uppercase tracking-wider">
            <a
              href="/"
              className="text-foreground-muted hover:text-accent transition-colors"
            >
              Home
            </a>
            <span className="mx-2 text-foreground-muted">/</span>
            <a
              href="/shop"
              className="text-foreground-muted hover:text-accent transition-colors"
            >
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
  );
}
