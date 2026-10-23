import { PageNav } from "@/components/page-nav";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">GradVision</h1>
      <p className="mt-2">Graduate school planning, all in one place.</p>
      <PageNav current="/" />
    </main>
  );
}