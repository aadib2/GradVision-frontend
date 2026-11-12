import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth-cookies";
import { getApiBaseUrl, getApiErrorMessage } from "@/lib/api";

type LoginRequestBody = {
  email?: unknown;
  password?: unknown;
};

type BackendTokenResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
};

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required." },
      { status: 400 },
    );
  }

  let apiBaseUrl: string;

  try {
    apiBaseUrl = getApiBaseUrl();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "API URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.",
      },
      { status: 500 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to reach the server. Check your connection and try again.",
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
      { status: backendResponse.status },
    );
  }

  let tokenData: BackendTokenResponse;

  try {
    tokenData = (await backendResponse.json()) as BackendTokenResponse;
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}
