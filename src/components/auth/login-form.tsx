"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthFormAlert } from "@/components/auth/auth-form-alert";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { ApiRequestError, loginUser } from "@/lib/api";

type LoginFormProps = {
  showRegisteredMessage?: boolean;
};

export function LoginForm({ showRegisteredMessage = false }: LoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await loginUser({ email, password });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm onSubmit={handleSubmit}>
      {showRegisteredMessage ? (
        <AuthFormAlert variant="success">
          Account created. Please sign in.
        </AuthFormAlert>
      ) : null}

      {errorMessage ? (
        <AuthFormAlert variant="error">{errorMessage}</AuthFormAlert>
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

      <AuthSubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </AuthSubmitButton>

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
  );
}
