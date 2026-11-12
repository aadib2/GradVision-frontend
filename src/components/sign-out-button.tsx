"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiRequestError, logoutUser } from "@/lib/api";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  className?: string;
  variant?: "sidebar" | "mobile";
};

export function SignOutButton({
  className,
  variant = "sidebar",
}: SignOutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setErrorMessage(null);
    setIsSigningOut(true);

    try {
      await logoutUser();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Unable to sign out. Please try again.";
      setErrorMessage(message);
      setIsSigningOut(false);
    }
  }

  const isSidebar = variant === "sidebar";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={isSigningOut}
        aria-busy={isSigningOut}
        className={cn(
          "flex w-full items-center gap-3 rounded-[12px] border border-[var(--blue)] bg-[var(--white)] font-serif font-bold text-[var(--blue)] transition-colors",
          "hover:bg-[var(--cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]",
          "disabled:pointer-events-none disabled:opacity-50",
          isSidebar
            ? "h-[50px] px-4 text-[20px]"
            : "mx-1 flex min-h-[52px] flex-col items-center justify-center gap-1 px-2 py-2 text-sm leading-none",
        )}
      >
        <LogOut
          className={cn("shrink-0", isSidebar ? "size-6" : "size-5")}
          strokeWidth={2}
          aria-hidden
        />
        Log out
      </button>
      {errorMessage ? (
        <p
          role="alert"
          className={cn(
            "text-xs text-[var(--burgundy)]",
            isSidebar ? "px-1 text-left" : "text-center",
          )}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
