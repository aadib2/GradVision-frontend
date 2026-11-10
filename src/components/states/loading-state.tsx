import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Small spinner with text. Use inside buttons or small sections. */
export function Spinner({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

/** Gray placeholder rows. Use while a list of cards is loading. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  );
}

/** Placeholder for a whole page: header area plus a grid of cards. */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-5 w-80 max-w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
