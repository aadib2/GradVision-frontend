import { AlertCircle, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

/** Box with an error message and an optional "Try again" button. */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-[14px] border border-[var(--burgundy)]/40 bg-[#fffcf4] p-5 text-[var(--blue)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-bold text-[var(--burgundy)]">
        <AlertCircle className="size-5" aria-hidden />
        {title}
      </div>
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--blue)] px-3 py-1.5 text-sm font-bold transition-colors hover:bg-[var(--blue)] hover:text-white"
        >
          <RotateCw className="size-4" aria-hidden />
          Try again
        </button>
      )}
    </div>
  );
}

/** Small red text under a form field or form. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1 text-sm text-[var(--burgundy)]">
      <AlertCircle className="size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
