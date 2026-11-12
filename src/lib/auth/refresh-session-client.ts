"use client";

const REFRESH_LOCK_NAME = "gradvision-auth-refresh";

const SERVICE_UNAVAILABLE_MESSAGE =
  "We're having trouble reaching our servers. Please try again in a moment.";

export type RefreshSessionResult =
  | { status: "success" }
  | { status: "unauthorized" }
  | { status: "unavailable"; message: string };

let inFlightRefresh: Promise<RefreshSessionResult> | null = null;

async function fetchRefreshSession(): Promise<RefreshSessionResult> {
  let response: Response;

  try {
    response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    return {
      status: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  if (response.status === 401) {
    return { status: "unauthorized" };
  }

  if (response.status >= 500 || response.status === 503) {
    let message = SERVICE_UNAVAILABLE_MESSAGE;

    try {
      const data = (await response.json()) as { error?: unknown };
      if (typeof data.error === "string" && data.error.trim()) {
        message = data.error;
      }
    } catch {
      // Keep default message.
    }

    return { status: "unavailable", message };
  }

  if (!response.ok) {
    return {
      status: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  try {
    const data = (await response.json()) as { success?: unknown };
    if (data.success === true) {
      return { status: "success" };
    }
  } catch {
    return {
      status: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  return {
    status: "unavailable",
    message: SERVICE_UNAVAILABLE_MESSAGE,
  };
}

/**
 * Refreshes the session through the frontend handler.
 * Concurrent callers (tabs, Strict Mode, multiple components) share one refresh.
 */
export function refreshSessionWithDedup(): Promise<RefreshSessionResult> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  const executeRefresh = async (): Promise<RefreshSessionResult> => {
    if (typeof navigator !== "undefined" && "locks" in navigator) {
      return navigator.locks.request(REFRESH_LOCK_NAME, fetchRefreshSession);
    }

    return fetchRefreshSession();
  };

  inFlightRefresh = executeRefresh().finally(() => {
    inFlightRefresh = null;
  });

  return inFlightRefresh;
}
