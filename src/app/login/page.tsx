import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to GradVision to continue discovering, comparing, and saving graduate programs.",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const showRegisteredMessage = registered === "1";

  return (
    <AuthPageShell tagline="Start planning your future today">
      <LoginForm showRegisteredMessage={showRegisteredMessage} />
    </AuthPageShell>
  );
}
