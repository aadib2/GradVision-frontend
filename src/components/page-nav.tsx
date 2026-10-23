import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/my-vision", label: "My Vision" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explore", label: "Explore" },
] as const;

type PageNavProps = {
  current: string;
};

export function PageNav({ current }: PageNavProps) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {routes
        .filter((route) => route.href !== current)
        .map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {route.label}
          </Link>
        ))}
    </nav>
  );
}
