export type RegisterUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type ApiErrorBody = {
  success: false;
  error: string;
};

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl?.trim()) {
    throw new ApiRequestError(
      "API URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.",
    );
  }

  return baseUrl.replace(/\/$/, "");
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === false &&
    "error" in value &&
    typeof value.error === "string"
  );
}

export function getApiErrorMessage(
  data: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isApiErrorBody(data) && data.error.trim()) {
    return data.error;
  }

  return fallback;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function loginUser(payload: LoginPayload): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiRequestError(
      "Unable to reach the server. Check your connection and try again.",
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      return;
    }

    throw new ApiRequestError("Something went wrong. Please try again.");
  }

  if (
    response.ok &&
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    data.success === true
  ) {
    return;
  }

  throw new ApiRequestError(getApiErrorMessage(data));
}

export async function registerUser(payload: RegisterUserPayload): Promise<void> {
  const url = `${getApiBaseUrl()}/users`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiRequestError(
      "Unable to reach the server. Check your connection and try again.",
    );
  }

  if (response.status === 201) {
    return;
  }

  let message = "Something went wrong. Please try again.";

  try {
    const data: unknown = await response.json();
    message = getApiErrorMessage(data, message);
  } catch {
    // Non-JSON or empty body — keep generic message.
  }

  throw new ApiRequestError(message);
}
