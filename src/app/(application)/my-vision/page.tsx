import { ApplicationPageHeader } from "@/components/application-page-header";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";

export default function MyVisionPage() {
  return renderProtectedApplicationPage("/my-vision", () => (
    <main className="flex-1">
      <ApplicationPageHeader
        title="My Vision"
        description="Your academic direction."
      />
    </main>
  ));
}
