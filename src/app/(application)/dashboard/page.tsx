import { ApplicationPageHeader } from "@/components/application-page-header";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";

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
