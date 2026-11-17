import { Skeleton } from "@/components/states/loading-state";

// Shown while the dashboard data loads. Same layout as the real dashboard.
export default function DashboardLoading() {
  const card = "rounded-[14px] border border-[#a9bac3] bg-[#fffcf4] p-5";

  return (
    <main className="flex-1" role="status" aria-label="Loading dashboard">
      <div className="flex flex-col gap-3 border-b border-[#a9bac3] bg-[#fffcf4] px-4 py-8 md:px-8">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[630fr_430fr]">
          <div className={card}>
            <Skeleton className="mb-5 h-6 w-48" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-3.5 h-3 w-full" />
            ))}
          </div>
          <div className={card}>
            <Skeleton className="mb-5 h-6 w-44" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="mb-2.5 h-[38px] w-full" />
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[630fr_430fr]">
          <div className={card}>
            <Skeleton className="mb-5 h-6 w-40" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[130px] rounded-[10px]" />
              ))}
            </div>
          </div>
          <div className={card}>
            <Skeleton className="mb-5 h-6 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="mb-3 h-6 w-full" />
            ))}
          </div>
        </div>

        <div className={card}>
          <Skeleton className="mb-5 h-7 w-48" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[238px] rounded-[14px]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
