import { PageNav } from "@/components/page-nav";

export default function ExplorePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl">Explore</h1>
      <p className="mt-2">
        Discover Graduate Opportunities that Match Your Interests
      </p>
      <PageNav current="/explore" />
    </main>
  );
}
