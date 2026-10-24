"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  NotebookText,
  Search,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/my-vision", label: "My Vision", icon: GraduationCap },
  { href: "/dashboard", label: "Dashboard", icon: NotebookText },
  { href: "/explore", label: "Explore", icon: Search },
] as const;

function SidebarNavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: typeof GraduationCap;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-[50px] w-full items-center gap-3 rounded-[12px] border border-[var(--blue)] px-4 font-serif text-[20px] font-bold transition-colors",
        isActive
          ? "bg-[var(--white)]"
          : "bg-transparent hover:bg-[var(--white)]",
      )}
    >
      <Icon className="size-6 shrink-0" strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-56 shrink-0 flex-col border-r border-[var(--blue)] bg-[var(--cream)] px-4 py-6"
      aria-label="Application"
    >
      <div className="mb-8 flex items-center gap-2 px-2">
        <GraduationCap
          className="size-6 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <span className="font-serif text-[25px] leading-none font-bold text-[var(--blue)]">
          GradVision
        </span>
      </div>

      <nav className="flex flex-col gap-3 pt-[30px]">
        {mainNavItems.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div
        className="mt-auto flex h-[50px] w-full items-center gap-3 rounded-[12px] px-4 font-serif text-[20px] font-bold text-[var(--blue)] transition-colors hover:bg-[var(--white)]"
      >
        <Settings className="size-6 shrink-0" strokeWidth={2} aria-hidden />
        Settings
      </div>
    </aside>
  );
}
