import { PageNav } from "@/components/page-nav";

export default function MyVisionPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">My Vision</h1>
      <p className="mt-2">Your academic direction.</p>
      <PageNav current="/my-vision" />
    </main>
  );
}
