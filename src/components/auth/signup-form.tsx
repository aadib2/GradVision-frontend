"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthFormAlert } from "@/components/auth/auth-form-alert";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { ApiRequestError, registerUser } from "@/lib/api";

export function SignupForm() {
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
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!firstName || !lastName) {
      setErrorMessage("First and last name cannot be empty.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      router.push("/login?registered=1");
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
      {errorMessage ? (
        <AuthFormAlert variant="error">{errorMessage}</AuthFormAlert>
      ) : null}

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

      <AuthSubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </AuthSubmitButton>

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
  );
}
