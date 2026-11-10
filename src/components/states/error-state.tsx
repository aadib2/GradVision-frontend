import { AlertCircle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Red box with a message and an optional "Try again" button. */
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
        "flex flex-col items-start gap-3 rounded-xl border border-(--burgundy)/40 bg-(--cream) p-5 text-(--blue)",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-bold text-(--burgundy)">
        <AlertCircle className="size-5" aria-hidden />
        {title}
      </div>
      <p className="text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCw aria-hidden />
          Try again
        </Button>
      )}
    </div>
  );
}

/** Small red text under a form field or form. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1 text-sm text-(--burgundy)">
      <AlertCircle className="size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
