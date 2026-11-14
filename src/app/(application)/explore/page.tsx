import type { Metadata } from "next";

import { ApplicationPageHeader } from "@/components/application-page-header";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Discover and compare graduate programs that match your interests and goals.",
};

export default function ExplorePage() {
  return renderProtectedApplicationPage("/explore", () => (
    <main className="flex-1">
      <ApplicationPageHeader
        title="Explore"
        description="Discover Graduate Opportunities that Match Your Interests"
      />
    </main>
  ));
}
