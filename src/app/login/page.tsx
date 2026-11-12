import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

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
