"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/api";

type ApiState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "error"; data: null; error: string }
  | { status: "ready"; data: T; error: null };

/**
 * Loads data once when the component mounts and tracks loading / error.
 *
 * Example:
 *   const { state, reload } = useApi(() => api.get("/programs/").then((r) => r.data));
 *   if (state.status === "loading") return <ListSkeleton />;
 *   if (state.status === "error") return <ErrorState message={state.error} onRetry={reload} />;
 *   return <ProgramList programs={state.data} />;
 *
 * Note: `fetcher` should not change between renders (define it outside the
 * component, or wrap it in useCallback).
 */
export function useApi<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({
    status: "loading",
    data: null,
    error: null,
  });

  const run = useCallback(async (): Promise<ApiState<T>> => {
    try {
      const data = await fetcher();
      return { status: "ready", data, error: null };
    } catch (error) {
      return { status: "error", data: null, error: getErrorMessage(error) };
    }
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;
    run().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, [run]);

  const reload = useCallback(async () => {
    setState({ status: "loading", data: null, error: null });
    setState(await run());
  }, [run]);

  return { state, reload };
}
