import { NextResponse } from "next/server";

import { getApiErrorMessage } from "@/lib/api";
import { backendFetch, getBackendAuth } from "@/lib/auth/backend-request";

/**
 * BFF for creating a dashboard task.
 * Proxies to POST {NEXT_PUBLIC_API_URL}/users/{id}/tasks/
 */
export async function POST(request: Request) {
  const auth = await getBackendAuth();
  if (!auth) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  let body: { title?: unknown; due_date?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ success: false, error: "Task title is required." }, { status: 400 });
  }
  const dueDate = typeof body.due_date === "string" && body.due_date ? body.due_date : null;

  let backendResponse: Response;
  try {
    backendResponse = await backendFetch(auth, `/users/${auth.userId}/tasks/`, {
      method: "POST",
      body: JSON.stringify({ title, due_date: dueDate }),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to reach the server. Please try again." },
      { status: 503 },
    );
  }

  const data: unknown = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(data, "Couldn't add the task.") },
      { status: backendResponse.status },
    );
  }

  const task = typeof data === "object" && data !== null && "task" in data ? data.task : null;
  return NextResponse.json({ success: true, task }, { status: 201 });
}
