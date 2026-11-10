import axios from "axios";

export const TOKEN_KEY = "gradvision_token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
});

// Attach the saved login token to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * The backend puts the user id in the JWT "sub" field, so we read it from the
 * saved token instead of needing a separate /me endpoint.
 */
export function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

/** Turns an axios error into a short message we can show to the user. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Is the backend running?";
    }
    if (error.response.status === 401) {
      return "Your session expired. Please log in again.";
    }
    const detail = error.response.data?.detail;
    if (typeof detail === "string") return detail;
  }
  return "Something went wrong. Please try again.";
}

export default api;
