"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">!</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tighter mb-4">
          Something went wrong
        </h2>
        <p className="font-mono text-sm text-foreground-muted mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button variant="brutal" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
