import { PageSkeleton } from "@/components/states/loading-state";

// Next.js shows this automatically while a page inside the app is loading.
export default function ApplicationLoading() {
  return (
    <main className="flex-1">
      <PageSkeleton />
    </main>
  );
}
