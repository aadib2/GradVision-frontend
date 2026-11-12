import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = {
  children: string;
  disabled?: boolean;
};

export function AuthSubmitButton({
  children,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "h-12 w-full max-w-xs self-center rounded-[12px] border border-[var(--blue)] bg-[var(--blue)]",
        "px-6 text-base font-medium text-[var(--white)] transition-opacity",
        "hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}
