import * as React from "react"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value = 0,
  label,
  ...props
}: React.ComponentProps<"div"> & { value?: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-(--gray)/50", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-(--gold) transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { Progress }
