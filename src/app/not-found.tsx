import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 p-8">
      <p className="font-serif text-6xl font-bold">404</p>
      <h1 className="text-3xl">Page not found</h1>
      <p>We couldn&apos;t find that page. It may have moved or never existed.</p>
      <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
        Back to dashboard
      </Link>
    </main>
  );
}
