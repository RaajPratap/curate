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

export default ProductCardSkeleton;
