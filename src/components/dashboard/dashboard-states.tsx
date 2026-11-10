import Link from "next/link";
import { AlertCircle, LogIn, RotateCw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card role="alert" className="border-(--burgundy)/40">
      <CardContent className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2 font-bold text-(--burgundy)">
          <AlertCircle className="size-5" aria-hidden />
          Couldn&apos;t load your dashboard
        </div>
        <p className="text-sm">{message}</p>
        <Button variant="outline" onClick={onRetry}>
          <RotateCw aria-hidden />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardLoggedOut() {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3">
        <p className="font-bold">Log in to see your dashboard.</p>
        <p className="text-sm">
          Your applications, tasks and saved programs will show up here.
        </p>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
          <LogIn aria-hidden />
          Go to login
        </Link>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  text,
  href,
  linkLabel,
}: {
  text: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-(--blue)/30 p-4 text-sm">
      <p>{text}</p>
      {href && linkLabel && (
        <Link href={href} className="font-bold underline underline-offset-4">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
