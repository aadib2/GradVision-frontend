import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api";
import {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
} from "@/lib/auth-cookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    try {
      const apiBaseUrl = getApiBaseUrl();
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
    } catch {
      // Still clear local cookies if the backend is unavailable.
    }
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
