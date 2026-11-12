import type { NextResponse } from "next/server";

/** Cookie max-age values aligned with backend token lifetimes. */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

type AuthCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export function getAuthCookieOptions(maxAge: number): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    getAuthCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
  );
}

export function clearAuthCookies(response: NextResponse): void {
  const cleared = getAuthCookieOptions(0);
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", cleared);
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", cleared);
}
