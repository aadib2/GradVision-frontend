import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Gray pulsing block used as a placeholder while content loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#e7e2d2]", className)} />;
}

/** Small spinner with text. Use inside buttons or small sections. */
export function Spinner({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

/** Placeholder rows. Use while a list of cards is loading. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-[10px]" />
      ))}
    </div>
  );
}

/** Placeholder for a whole page: header area plus a grid of cards. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page">
      <div className="flex flex-col gap-3 border-b border-[#a9bac3] px-4 py-8 md:px-8">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 px-4 py-6 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}
