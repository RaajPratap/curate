"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { ProductGrid, Product } from "@/components/product";
import { Select, Button, Badge } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, selectCartCount } from "@/store/slices/cartSlice";
import { productsService } from "@/lib/api/products";
import { categories, ecoRatings, sortOptions } from "@/lib/mock-data";

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [ecoRating, setEcoRating] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productsService.getProducts({
          category: category || undefined,
          ecoRating: ecoRating || undefined,
          sortBy: sortBy as
            | "newest"
            | "price-asc"
            | "price-desc"
            | "eco-rating",
        });
        setProducts(result.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, ecoRating, sortBy]);

  const handleQuickAdd = (product: Product) => {
    // Default to first size if available
    const defaultSize = product.sizes?.[0] || "";
    dispatch(addToCart({ product, size: defaultSize, quantity: 1 }));
  };

  const activeFiltersCount = [category, ecoRating].filter(Boolean).length;

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Page Header */}
      <section className="border-b border-border py-12">
        <Container>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-2">
            SHOP
          </h1>
          <p className="font-mono text-foreground-muted text-sm uppercase tracking-wider">
            {loading ? "Loading..." : `${products.length} Products`}
          </p>
        </Container>
      </section>

      {/* Filters & Products */}
      <section className="py-8">
        <Container>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            {/* Mobile Filter Toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="accent" size="sm" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4">
              <Select
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-44"
              />
              <Select
                options={ecoRatings}
                value={ecoRating}
                onChange={(e) => setEcoRating(e.target.value)}
                className="w-40"
              />
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategory("");
                    setEcoRating("");
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-foreground-muted uppercase hidden sm:block">
                Sort:
              </span>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mb-8 pb-8 border-b border-border space-y-4">
              <Select
                label="Category"
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Select
                label="Eco Rating"
                options={ecoRatings}
                value={ecoRating}
                onChange={(e) => setEcoRating(e.target.value)}
              />
              {activeFiltersCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCategory("");
                    setEcoRating("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category && (
                <button
                  onClick={() => setCategory("")}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border font-mono text-xs uppercase tracking-wider hover:border-accent transition-colors"
                >
                  {categories.find((c) => c.value === category)?.label}
                  <span className="text-accent">×</span>
                </button>
              )}
              {ecoRating && (
                <button
                  onClick={() => setEcoRating("")}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border font-mono text-xs uppercase tracking-wider hover:border-accent transition-colors"
                >
                  Eco Rating: {ecoRating}
                  <span className="text-accent">×</span>
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-foreground-muted text-sm uppercase tracking-wider">
                  Loading products...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <p className="font-mono text-red-500 text-sm uppercase tracking-wider mb-4">
                  {error}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <ProductGrid
              products={products}
              columns={4}
              onQuickAdd={handleQuickAdd}
              emptyMessage="No products match your filters"
            />
          )}

          {/* Load More */}
          {!loading && !error && products.length >= 8 && (
            <div className="mt-12 text-center">
              <Button variant="secondary" size="lg">
                Load More
              </Button>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}
