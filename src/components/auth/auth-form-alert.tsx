import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthFormAlertProps = {
  children: ReactNode;
  variant?: "error" | "success";
  className?: string;
};

export function AuthFormAlert({
  children,
  variant = "error",
  className,
}: AuthFormAlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[12px] border px-4 py-3 text-sm sm:text-base",
        variant === "error"
          ? "border-[var(--burgundy)] bg-[color-mix(in_srgb,var(--burgundy)_12%,var(--white))] text-[var(--blue)]"
          : "border-[var(--blue)] bg-[var(--white)] text-[var(--blue)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
