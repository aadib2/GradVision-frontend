import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthFormAlert } from "@/components/auth/auth-form-alert";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const showRegisteredMessage = registered === "1";

  return (
    <AuthPageShell tagline="Start planning your future today">
      <AuthForm>
        {showRegisteredMessage ? (
          <AuthFormAlert variant="success">
            Account created. Please sign in.
          </AuthFormAlert>
        ) : null}
        <AuthField
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthField
          id="login-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <AuthSubmitButton>Sign in</AuthSubmitButton>

        <p className="text-center text-sm sm:text-base">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 font-medium hover:opacity-80"
          >
            No account? Click here to get started!
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </p>
      </AuthForm>
    </AuthPageShell>
  );
}
