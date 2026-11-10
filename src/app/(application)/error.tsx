"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/states/error-state";

// Next.js shows this if a page inside the app crashes. The sidebar stays visible.
export default function ApplicationError({
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
    <main className="flex-1 px-4 py-6 md:px-8">
      <ErrorState
        title="This page couldn't load"
        message="Something broke on our side. Try again, or go to another page from the menu."
        onRetry={reset}
      />
    </main>
  );
}
