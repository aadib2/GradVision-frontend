import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthPageShell tagline="Start planning your future today">
      <SignupForm />
    </AuthPageShell>
  );
}
