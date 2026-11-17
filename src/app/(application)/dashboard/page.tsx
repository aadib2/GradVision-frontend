import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { redirect } from "next/navigation";

import { ApplicationServiceError } from "@/components/application-service-error";
import {
  ApplicationProgress,
  SavedResearch,
  UpcomingDeadlines,
  WelcomeHeader,
} from "@/components/dashboard/dashboard-sections";
import { MyApplications } from "@/components/dashboard/my-applications";
import { TasksCard } from "@/components/dashboard/tasks-card";
import { getBackendAuth } from "@/lib/auth/backend-request";
import { renderProtectedApplicationPage } from "@/lib/auth/protected-page";
import { SAMPLE_DASHBOARD_DATA, type DashboardData } from "@/lib/dashboard";
import { DashboardLoadError, fetchDashboardData } from "@/lib/dashboard-server";
import { cn } from "@/lib/utils";

// Fonts used by the Figma dashboard design.
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track upcoming deadlines and next steps in your graduate application journey.",
};

// Set NEXT_PUBLIC_USE_SAMPLE_DATA=true in .env.local to preview the page
// with the Figma sample data, without logging in or running the backend.
const USE_SAMPLE_DATA = process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === "true";

function DashboardView({
  firstName,
  data,
  isSample,
}: {
  firstName: string;
  data: DashboardData;
  isSample: boolean;
}) {
  return (
    <main
      className={cn(
        lora.variable,
        inter.variable,
        "flex-1 font-[family-name:var(--font-inter)] text-[var(--blue)]",
      )}
    >
      <WelcomeHeader firstName={firstName} />

      <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
        {isSample && (
          <p className="rounded-lg bg-[var(--gold)]/25 px-4 py-2 text-sm">
            Showing sample data (NEXT_PUBLIC_USE_SAMPLE_DATA is on).
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-[630fr_430fr]">
          <ApplicationProgress data={data} />
          <UpcomingDeadlines data={data} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[630fr_430fr]">
          <SavedResearch data={data} />
          <TasksCard initialTasks={data.tasks} isSample={isSample} />
        </div>

        <MyApplications applications={data.applications} events={data.events} />
      </div>
    </main>
  );
}

export default async function DashboardPage() {
  if (USE_SAMPLE_DATA) {
    return <DashboardView firstName="Adelina" data={SAMPLE_DASHBOARD_DATA} isSample />;
  }

  return renderProtectedApplicationPage("/dashboard", async (user) => {
    const auth = await getBackendAuth();
    if (!auth) redirect("/login");

    try {
      const data = await fetchDashboardData(auth);
      return <DashboardView firstName={user.first_name} data={data} isSample={false} />;
    } catch (error) {
      if (error instanceof DashboardLoadError && error.status === 401) {
        redirect("/login");
      }
      return (
        <main className="flex-1">
          <ApplicationServiceError
            message="We couldn't load your dashboard. Please try again in a moment."
            retryHref="/dashboard"
          />
        </main>
      );
    }
  });
}
