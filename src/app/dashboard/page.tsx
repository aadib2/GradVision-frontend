import { PageNav } from "@/components/page-nav";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">Dashboard</h1>
      <p className="mt-2">Here’s what’s coming up in your application journey.</p>
      <PageNav current="/dashboard" />
    </main>
  )
}