"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { refreshSessionWithDedup } from "@/lib/auth/refresh-session-client";
import { cn } from "@/lib/utils";

const MAX_REFRESH_ATTEMPTS = 3;

export function RestoringSession() {
  const router = useRouter();
  const [isRetryableError, setIsRetryableError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const refreshAttemptsRef = useRef(0);

  const handleRefreshResult = useCallback(
    (result: Awaited<ReturnType<typeof refreshSessionWithDedup>>) => {
      if (result.status === "success") {
        router.refresh();
        return;
      }

      if (result.status === "unauthorized") {
        router.replace("/login");
        return;
      }

      setIsRetryableError(true);
      setErrorMessage(result.message);
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (refreshAttemptsRef.current >= MAX_REFRESH_ATTEMPTS) {
        router.replace("/login");
        return;
      }

      refreshAttemptsRef.current += 1;
      const result = await refreshSessionWithDedup();

      if (cancelled) {
        return;
      }

      handleRefreshResult(result);
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [handleRefreshResult, router]);

  const retryRefresh = useCallback(async () => {
    if (refreshAttemptsRef.current >= MAX_REFRESH_ATTEMPTS) {
      router.replace("/login");
      return;
    }

    refreshAttemptsRef.current += 1;
    setIsRetryableError(false);
    setErrorMessage(null);

    const result = await refreshSessionWithDedup();
    handleRefreshResult(result);
  }, [handleRefreshResult, router]);

  if (isRetryableError) {
    return (
      <div
        role="alert"
        className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center text-[var(--blue)]"
      >
        <h2 className="font-serif text-2xl font-bold">
          Service temporarily unavailable
        </h2>
        <p className="mt-3 max-w-md text-base">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void retryRefresh()}
          className={cn(
            "mt-6 text-base font-medium underline underline-offset-2 hover:opacity-80",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]",
          )}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center text-[var(--blue)]"
    >
      <p className="font-serif text-xl font-bold">Restoring session…</p>
    </div>
  );
}
