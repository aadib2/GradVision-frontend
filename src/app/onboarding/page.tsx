import { PageNav } from "@/components/page-nav";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">Onboarding</h1>
      <p className="mt-2">Let’s build your GradVision</p>
      <PageNav current="/onboarding" />
    </main>
  );
}
