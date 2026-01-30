import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-pulse">
      {/* Progress bar skeleton */}
      <div className="flex w-full items-center gap-1.5 px-4 pt-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[3px] flex-1 bg-zinc-700 rounded-full" />
        ))}
      </div>
      
      {/* Image skeleton */}
      <div className="aspect-square mt-2 bg-zinc-700 mx-4 rounded-xl" />
      
      {/* Content skeleton */}
      <div className="p-6 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-zinc-700 rounded w-1/2" />
            <div className="h-3 bg-zinc-700 rounded w-1/3" />
          </div>
          <div className="h-6 bg-zinc-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex flex-wrap px-20 py-10 gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const SectionSkeleton = ({ title = "Loading..." }) => {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center px-20 py-8">
        <div className="h-8 bg-zinc-700 rounded w-48" />
        <div className="h-10 bg-zinc-700 rounded-full w-32" />
      </div>
      
      {/* Grid skeleton */}
      <ProductGridSkeleton count={6} />
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-900 animate-pulse">
      {/* Header skeleton */}
      <div className="w-full h-[10vw] px-10 py-8 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-8 bg-zinc-700 rounded w-16" />
          <div className="h-8 bg-zinc-700 rounded w-16" />
          <div className="h-8 bg-zinc-700 rounded w-20" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-zinc-700 rounded w-16" />
          <div className="h-8 bg-zinc-700 rounded w-20" />
        </div>
      </div>
      
      {/* Hero skeleton */}
      <div className="w-full h-[70vh] bg-zinc-800" />
      
      {/* Content sections */}
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="pt-[10vw] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 bg-zinc-700 rounded w-12" />
        <div className="h-4 bg-zinc-700 rounded w-2" />
        <div className="h-4 bg-zinc-700 rounded w-12" />
        <div className="h-4 bg-zinc-700 rounded w-2" />
        <div className="h-4 bg-zinc-700 rounded w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-zinc-800 rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-zinc-700 rounded w-24" />
            <div className="h-10 bg-zinc-700 rounded w-3/4" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 bg-zinc-700 rounded" />
              ))}
            </div>
            <div className="h-8 bg-zinc-700 rounded w-32" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-zinc-700 rounded w-full" />
            <div className="h-4 bg-zinc-700 rounded w-full" />
            <div className="h-4 bg-zinc-700 rounded w-3/4" />
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-6 h-6 bg-zinc-700 rounded mx-auto" />
                <div className="h-3 bg-zinc-700 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-4 bg-zinc-700 rounded w-20" />
            <div className="h-10 bg-zinc-800 rounded-full w-32" />
            <div className="h-4 bg-zinc-700 rounded w-24" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 h-14 bg-zinc-700 rounded-full" />
            <div className="w-14 h-14 bg-zinc-800 rounded-full" />
            <div className="w-14 h-14 bg-zinc-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WishlistSkeleton = () => {
  return (
    <div className="pt-[10vw] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-10 bg-zinc-700 rounded w-48" />
          <div className="h-5 bg-zinc-700 rounded w-32" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-zinc-700 rounded-full w-28" />
          <div className="h-10 bg-zinc-700 rounded-full w-28" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-800 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-zinc-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-700 rounded w-1/3" />
              <div className="h-5 bg-zinc-700 rounded w-3/4" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-4 h-4 bg-zinc-700 rounded" />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-zinc-700 rounded w-20" />
                <div className="h-10 bg-zinc-700 rounded-full w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
