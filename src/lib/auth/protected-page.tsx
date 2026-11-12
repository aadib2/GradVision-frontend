import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ApplicationServiceError } from "@/components/application-service-error";
import { RestoringSession } from "@/components/restoring-session";
import { getValidatedSession } from "@/lib/auth/session";

/**
 * Runs a server-side session check for application pages.
 * Returns page content, a retryable error view, or redirects to login.
 */
export async function renderProtectedApplicationPage(
  retryHref: string,
  render: () => ReactNode,
): Promise<ReactNode> {
  const session = await getValidatedSession();

  if (!session.ok && session.reason === "refreshable") {
    return (
      <main className="flex-1">
        <RestoringSession />
      </main>
    );
  }

  if (!session.ok && session.reason === "unauthorized") {
    redirect("/login");
  }

  if (!session.ok && session.reason === "unavailable") {
    return (
      <main className="flex-1">
        <ApplicationServiceError message={session.message} retryHref={retryHref} />
      </main>
    );
  }

  return render();
}
