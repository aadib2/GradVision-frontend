import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicRoutes = [
  { href: "/", label: "Home" },
  { href: "/signup", label: "Sign Up" },
  { href: "/login", label: "Login" },
  { href: "/onboarding", label: "Onboarding" },
] as const;

const applicationRoutes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explore", label: "Explore" },
  { href: "/my-vision", label: "My Vision" },
] as const;

type PageNavProps = {
  current: string;
};

function NavLink({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current: string;
}) {
  const isCurrent = href === current;

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      {label}
    </Link>
  );
}

export function PageNav({ current }: PageNavProps) {
  return (
    <nav className="mt-6 flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Public / account
        </p>
        <div className="flex flex-wrap gap-2">
          {publicRoutes.map((route) => (
            <NavLink
              key={route.href}
              href={route.href}
              label={route.label}
              current={current}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Application
        </p>
        <div className="flex flex-col items-start gap-2">
          {applicationRoutes.map((route) => (
            <NavLink
              key={route.href}
              href={route.href}
              label={route.label}
              current={current}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
