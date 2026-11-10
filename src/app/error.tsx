"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/states/error-state";

// Fallback for crashes on pages outside the app (landing, login, signup, onboarding).
export default function RootError({
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
    <main className="mx-auto flex w-full max-w-lg flex-1 items-center p-8">
      <ErrorState
        className="w-full"
        message="Something broke on our side. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
