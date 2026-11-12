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

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl?.trim()) {
    throw new ApiRequestError(
      "API URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.",
    );
  }

  return baseUrl.replace(/\/$/, "");
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === false &&
    "error" in value &&
    typeof value.error === "string"
  );
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
    if (isApiErrorBody(data) && data.error.trim()) {
      message = data.error;
    }
  } catch {
    // Non-JSON or empty body — keep generic message.
  }

  throw new ApiRequestError(message);
}
