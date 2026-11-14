import type { Metadata } from "next";

import { ApplicationPageHeader } from "@/components/application-page-header";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track upcoming deadlines and next steps in your graduate application journey.",
};

export default function DashboardPage() {
  return renderProtectedApplicationPage("/dashboard", () => (
    <main className="flex-1">
      <ApplicationPageHeader
        title="Dashboard"
        description="Here's what's coming up in your application journey."
      />
    </main>
  ));
}
