import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 p-8 text-[var(--blue)]">
      <p className="font-serif text-6xl font-bold">404</p>
      <h1 className="text-3xl">Page not found</h1>
      <p>We couldn&apos;t find that page. It may have moved or never existed.</p>
      <Link
        href="/"
        className="rounded-md border border-[var(--blue)] px-4 py-2 text-sm font-bold transition-colors hover:bg-[var(--blue)] hover:text-white"
      >
        Back to home
      </Link>
    </main>
  );
}
