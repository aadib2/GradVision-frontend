import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl, getApiErrorMessage } from "@/lib/api";
import {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth-cookies";

type BackendTokenResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
};

const SERVICE_UNAVAILABLE_MESSAGE =
  "We're having trouble reaching our servers. Please try again in a moment.";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken?.trim()) {
    const response = NextResponse.json(
      { success: false, error: "Session expired. Please sign in again." },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  let apiBaseUrl: string;

  try {
    apiBaseUrl = getApiBaseUrl();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
      },
      { status: 503 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
      },
      { status: 503 },
    );
  }

  if (backendResponse.status === 401 || backendResponse.status === 403) {
    const response = NextResponse.json(
      { success: false, error: "Session expired. Please sign in again." },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  if (backendResponse.status >= 500) {
    return NextResponse.json(
      {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
      },
      { status: 503 },
    );
  }

  if (!backendResponse.ok) {
    let message = "Something went wrong. Please try again.";

    try {
      const data: unknown = await backendResponse.json();
      message = getApiErrorMessage(data, message);
    } catch {
      // Non-JSON or empty body — keep generic message.
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 503 },
    );
  }

  let tokenData: BackendTokenResponse;

  try {
    tokenData = (await backendResponse.json()) as BackendTokenResponse;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
      },
      { status: 503 },
    );
  }

  const accessToken = tokenData.access_token;
  const nextRefreshToken = tokenData.refresh_token;

  if (typeof accessToken !== "string" || typeof nextRefreshToken !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
      },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ success: true });
  setAuthCookies(response, accessToken, nextRefreshToken);
  return response;
}
