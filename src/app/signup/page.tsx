import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

export default function SignupPage() {
  return (
    <AuthPageShell tagline="Start planning your future today">
      <AuthForm>
        <div className="grid grid-cols-2 gap-4">
          <AuthField
            id="signup-first-name"
            label="First name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
          />
          <AuthField
            id="signup-last-name"
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
          />
        </div>
        <AuthField
          id="signup-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthField
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
        />

        <AuthSubmitButton>Create account</AuthSubmitButton>

        <p className="text-center text-sm sm:text-base">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-medium hover:opacity-80"
          >
            Already have an account? Login.
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </p>
      </AuthForm>
    </AuthPageShell>
  );
}
