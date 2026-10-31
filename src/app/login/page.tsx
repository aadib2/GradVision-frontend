import { PageNav } from "@/components/page-nav";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">Login</h1>
      <p className="mt-2">Start planning your future today</p>
      <PageNav current="/login" />
    </main>
  );
}
