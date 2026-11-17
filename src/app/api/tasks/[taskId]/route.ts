import { NextResponse } from "next/server";

import { getApiErrorMessage } from "@/lib/api";
import { backendFetch, getBackendAuth } from "@/lib/auth/backend-request";

/**
 * BFF for checking or unchecking a dashboard task.
 * Proxies to PATCH {NEXT_PUBLIC_API_URL}/tasks/{task_id}
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const auth = await getBackendAuth();
  if (!auth) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  const { taskId } = await params;
  if (!/^\d+$/.test(taskId)) {
    return NextResponse.json({ success: false, error: "Invalid task id." }, { status: 400 });
  }

  let body: { completed?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.completed !== "boolean") {
    return NextResponse.json({ success: false, error: "completed must be true or false." }, { status: 400 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await backendFetch(auth, `/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: body.completed }),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to reach the server. Please try again." },
      { status: 503 },
    );
  }

  if (!backendResponse.ok) {
    const data: unknown = await backendResponse.json().catch(() => null);
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(data, "Couldn't update the task.") },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ success: true });
}
