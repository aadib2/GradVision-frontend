import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free GradVision account to start discovering, comparing, and saving graduate programs.",
};

export default function SignupPage() {
  return (
    <AuthPageShell tagline="Start planning your future today">
      <SignupForm />
    </AuthPageShell>
  );
}
