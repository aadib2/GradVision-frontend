import type { Metadata } from "next";

import { ApplicationPageHeader } from "@/components/application-page-header";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";

export const metadata: Metadata = {
  title: "My Vision",
  description:
    "Review your saved graduate programs and shape your academic direction.",
};

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
