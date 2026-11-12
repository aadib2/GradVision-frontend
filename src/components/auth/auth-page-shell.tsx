import Image from "next/image";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  tagline: string;
  children: ReactNode;
};

export function AuthPageShell({ tagline, children }: AuthPageShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--cream)] px-6 py-10 text-[var(--blue)] sm:px-8 sm:py-14">
      <header className="mb-8 flex w-full max-w-xl flex-col items-center text-center sm:mb-10">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/gradvision-logo.svg"
            alt=""
            width={44}
            height={40}
            unoptimized
            className="h-10 w-auto shrink-0"
            aria-hidden
          />
          <h1 className="font-serif text-4xl font-bold leading-none sm:text-5xl">
            GradVision
          </h1>
        </div>
        <p className="mt-4 text-base sm:text-lg">{tagline}</p>
      </header>

      <div className="w-full max-w-xl">{children}</div>
    </main>
  );
}
