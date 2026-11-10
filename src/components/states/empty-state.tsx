import Link from "next/link";

/** Dashed box for "nothing here yet", with an optional link. */
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
