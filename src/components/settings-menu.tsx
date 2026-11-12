"use client";

import { Settings } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { SignOutButton } from "@/components/sign-out-button";
import { cn } from "@/lib/utils";

type SettingsMenuProps = {
  variant: "sidebar" | "mobile";
};

export function SettingsMenu({ variant }: SettingsMenuProps) {
  const isSidebar = variant === "sidebar";
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        isSidebar ? "mt-auto w-full" : "mx-1 flex flex-1 flex-col",
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "font-serif font-bold text-[var(--blue)] transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]",
          isSidebar
            ? "flex h-[50px] w-full items-center gap-3 rounded-[12px] border border-[color-mix(in_srgb,var(--blue)_10%,transparent)] px-4 text-[20px] hover:bg-[var(--white)]"
            : "flex w-full flex-col items-center justify-center gap-1 rounded-[12px] py-2 text-sm leading-none hover:bg-[var(--white)]",
          isOpen && "bg-[var(--white)]",
        )}
      >
        <Settings
          className={cn("shrink-0", isSidebar ? "size-6" : "size-5")}
          strokeWidth={2}
          aria-hidden
        />
        Settings
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute z-50",
            isSidebar
              ? "bottom-full left-0 right-0 mb-2"
              : "bottom-full left-1/2 mb-2 w-[min(100%,12rem)] -translate-x-1/2",
          )}
        >
          <SignOutButton variant={variant} />
        </div>
      ) : null}
    </div>
  );
}
