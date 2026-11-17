import { cookies } from "next/headers";

import { getApiBaseUrl } from "@/lib/api";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";
import { extractUserIdFromAccessToken } from "@/lib/auth/session";

export type BackendAuth = {
  accessToken: string;
  userId: number;
};

/** Reads the access token cookie and the user id inside it (server only). */
export async function getBackendAuth(): Promise<BackendAuth | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value?.trim();
  if (!accessToken) return null;

  const userId = extractUserIdFromAccessToken(accessToken);
  if (userId === null) return null;

  return { accessToken, userId };
}

/** Calls the FastAPI backend with the user's bearer token (server only). */
export async function backendFetch(
  auth: BackendAuth,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${auth.accessToken}`,
    },
    cache: "no-store",
  });
}
