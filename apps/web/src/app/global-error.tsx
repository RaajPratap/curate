"use client";

import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center p-8">
            <div className="w-16 h-16 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">!</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-6">
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
