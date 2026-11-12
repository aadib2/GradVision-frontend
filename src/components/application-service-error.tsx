import Link from "next/link";

type ApplicationServiceErrorProps = {
  message: string;
  retryHref?: string;
};

export function ApplicationServiceError({
  message,
  retryHref = "/dashboard",
}: ApplicationServiceErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center text-[var(--blue)]"
    >
      <h2 className="font-serif text-2xl font-bold">
        Service temporarily unavailable
      </h2>
      <p className="mt-3 max-w-md text-base">{message}</p>
      <Link
        href={retryHref}
        className="mt-6 text-base font-medium underline underline-offset-2 hover:opacity-80"
      >
        Try again
      </Link>
    </div>
  );
}
