import { productsApi } from "./client";
import { Product } from "@/components/product";

// Backend product type (from MongoDB)
interface BackendProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  variants?: Array<{
    size: string;
    color: { name: string; hex: string };
    sku: string;
    stock: number;
  }>;
  images?: Array<{ url: string; alt: string; order: number }>;
  tags?: string[];
  brand?: string;
  sustainability?: {
    impactScore?: number;
    rating?: "A" | "B" | "C" | "D" | "F";
    carbonFootprint?: { production: number; shipping: number; total: number };
    materials?: Array<{
      name: string;
      percentage: number;
      isRecycled?: boolean;
      isOrganic?: boolean;
      certification?: string;
    }>;
    certifications?: string[];
  };
  status?: string;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
  ratings?: { average: number; count: number };
}

// Transform backend product to frontend format
function transformProduct(backendProduct: BackendProduct): Product {
  const {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    variants = [],
    images = [],
    tags = [],
    sustainability,
    isFeatured,
    isLimitedEdition,
  } = backendProduct;

  // Extract unique colors from variants
  const colors = [
    ...new Set(variants.map((v) => v.color?.name).filter(Boolean)),
  ];

  // Extract unique sizes from variants
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  // Calculate total stock
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  // Get image URLs
  const imageUrls =
    images.length > 0
      ? images
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((img) => img.url)
      : ["/images/products/placeholder.jpg"];

  // Get category from tags (first tag that matches a category)
  const categoryTags = [
    "tees",
    "hoodies",
    "sweatshirts",
    "bottoms",
    "outerwear",
    "accessories",
  ];
  const category =
    tags.find((tag) => categoryTags.includes(tag.toLowerCase())) ||
    tags[0] ||
    "other";

  return {
    id: _id,
    name,
    slug,
    price,
    compareAtPrice,
    images: imageUrls,
    category: category.toLowerCase(),
    colors,
    sizes,
    sustainability: {
      ecoRating: sustainability?.rating || "C",
      carbonFootprint: sustainability?.carbonFootprint?.total || 0,
      materials:
        sustainability?.materials?.map((m) => ({
          name: m.name,
          percentage: m.percentage,
        })) || [],
      certifications: sustainability?.certifications || [],
    },
    isNew: isFeatured, // Using featured as "new" indicator
    isSoldOut: totalStock === 0,
    isLimitedEdition: isLimitedEdition || false,
  };
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: BackendProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface SingleProductResponse {
  success: boolean;
  data: {
    product: BackendProduct;
  };
}

export interface ProductFilters {
  category?: string;
  ecoRating?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price-asc" | "price-desc" | "eco-rating";
  page?: number;
  limit?: number;
}

export const productsService = {
  getProducts: async (
    filters: ProductFilters = {},
  ): Promise<{
    products: Product[];
    pagination: ProductsResponse["data"]["pagination"];
  }> => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.ecoRating)
      params.append("sustainabilityRating", filters.ecoRating);
    if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    // Map sort options
    if (filters.sortBy) {
      const sortMap: Record<string, string> = {
        newest: "-createdAt",
        "price-asc": "price",
        "price-desc": "-price",
        "eco-rating": "sustainability.rating",
      };
      params.append("sort", sortMap[filters.sortBy] || "-createdAt");
    }

    const queryString = params.toString();
    const url = `/api/products${queryString ? `?${queryString}` : ""}`;

    const response = await productsApi.get<ProductsResponse>(url);

    return {
      products: response.data.products.map(transformProduct),
      pagination: response.data.pagination,
    };
  },

  getProduct: async (slug: string): Promise<Product | null> => {
    try {
      const response = await productsApi.get<SingleProductResponse>(
        `/api/products/${slug}`,
      );
      return transformProduct(response.data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      return null;
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await productsApi.get<{
        success: boolean;
        data: { products: BackendProduct[] };
      }>("/api/products/featured");
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      return [];
    }
  },

  getDrops: async (): Promise<Product[]> => {
    try {
      const response = await productsApi.get<{
        success: boolean;
        data: { products: BackendProduct[] };
      }>("/api/products/drops");
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error("Failed to fetch drops:", error);
      return [];
    }
  },

  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await productsApi.get<ProductsResponse>(
        `/api/products?search=${encodeURIComponent(query)}`,
      );
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error("Failed to search products:", error);
      return [];
    }
  },
};
