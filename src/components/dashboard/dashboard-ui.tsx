import type { ReactNode } from "react";

import type { Tone } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

// Colors taken from the Figma dashboard (Desktop - 15).
export const muted = "text-[#667985]";

const toneStyles: Record<Tone, { badge: string; bar: string }> = {
  green: { badge: "bg-[#e4eee5] text-[#4e755f]", bar: "bg-[#4e755f]" },
  blue: { badge: "bg-[#ddeaf0] text-[var(--blue)]", bar: "bg-[var(--blue)]" },
  gold: { badge: "bg-[#f4e6cc] text-[#a46a2a]", bar: "bg-[#a46a2a]" },
  red: { badge: "bg-[#f3dde3] text-[var(--burgundy)]", bar: "bg-[var(--burgundy)]" },
};

export function DashboardCard({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-[14px] border border-[#a9bac3] bg-[#fffcf4] p-5",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeading({
  id,
  title,
  subtitle,
  action,
}: {
  id: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 id={id} className="font-[family-name:var(--font-lora)] text-[21px] leading-tight">
          {title}
        </h2>
        {subtitle && <p className={cn("mt-1 text-[11px]", muted)}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "blue",
  label,
  className,
}: {
  value: number;
  tone?: Tone;
  label: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-[7px] w-full overflow-hidden rounded-full bg-[#ddeaf0]", className)}
    >
      <div
        className={cn("h-full rounded-full", toneStyles[tone].bar)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[9px] font-extrabold",
        toneStyles[tone].badge,
      )}
    >
      {label}
    </span>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center rounded-md bg-[var(--blue)] px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)] disabled:opacity-50";
