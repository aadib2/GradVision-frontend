import Link from "next/link";

import { cn } from "@/lib/utils";

/** Dashed box for "nothing here yet", with an optional link. */
export function EmptyState({
  text,
  href,
  linkLabel,
  className,
}: {
  text: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#a9bac3] px-4 py-6 text-center text-sm text-[#667985]",
        className,
      )}
    >
      <p>{text}</p>
      {href && linkLabel && (
        <Link
          href={href}
          className="font-bold text-[var(--blue)] underline underline-offset-4 hover:opacity-80"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
