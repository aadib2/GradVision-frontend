import { cookies } from "next/headers";

import { getApiBaseUrl } from "@/lib/api";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";

/** User profile returned after the backend validates the access token. */
export type SessionUser = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type ValidatedSession =
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "unauthorized" }
  | {
      ok: false;
      reason: "unavailable";
      message: string;
    };

const SERVICE_UNAVAILABLE_MESSAGE =
  "We're having trouble reaching our servers. Please try again in a moment.";

/**
 * Reads `sub` from the JWT payload without verifying the signature.
 * The value is untrusted until the backend accepts the bearer token.
 */
export function extractUserIdFromAccessToken(token: string): number | null {
  const segments = token.split(".");
  if (segments.length !== 3) {
    return null;
  }

  try {
    const base64Url = segments[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(base64 + padding, "base64").toString("utf-8");
    const payload = JSON.parse(json) as { sub?: unknown };

    if (typeof payload.sub === "number" && Number.isInteger(payload.sub) && payload.sub > 0) {
      return payload.sub;
    }

    if (typeof payload.sub === "string" && /^\d+$/.test(payload.sub)) {
      const userId = Number.parseInt(payload.sub, 10);
      return userId > 0 ? userId : null;
    }

    return null;
  } catch {
    return null;
  }
}

function isSessionUser(value: unknown): value is SessionUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "user_id" in value &&
    typeof value.user_id === "number" &&
    "first_name" in value &&
    typeof value.first_name === "string" &&
    "last_name" in value &&
    typeof value.last_name === "string" &&
    "email" in value &&
    typeof value.email === "string"
  );
}

/**
 * Validates the current session by calling GET /users/{id} with the access token.
 * Reusable for future server-side authenticated requests.
 */
export async function getValidatedSession(): Promise<ValidatedSession> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken?.trim()) {
    return { ok: false, reason: "unauthorized" };
  }

  const userId = extractUserIdFromAccessToken(accessToken);
  if (userId === null) {
    return { ok: false, reason: "unauthorized" };
  }

  let apiBaseUrl: string;

  try {
    apiBaseUrl = getApiBaseUrl();
  } catch {
    return {
      ok: false,
      reason: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      reason: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, reason: "unauthorized" };
  }

  if (response.status >= 500) {
    return {
      ok: false,
      reason: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }

  if (!response.ok) {
    return { ok: false, reason: "unauthorized" };
  }

  try {
    const data: unknown = await response.json();
    if (!isSessionUser(data)) {
      return { ok: false, reason: "unauthorized" };
    }

    if (data.user_id !== userId) {
      return { ok: false, reason: "unauthorized" };
    }

    return { ok: true, user: data };
  } catch {
    return {
      ok: false,
      reason: "unavailable",
      message: SERVICE_UNAVAILABLE_MESSAGE,
    };
  }
}
