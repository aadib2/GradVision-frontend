"use client";

import { ApplicationPageHeader } from "@/components/application-page-header";
import {
  ApplicationTracker,
  SavedPrograms,
  SummaryStats,
  UpcomingTasks,
} from "@/components/dashboard/dashboard-sections";
import {
  DashboardError,
  DashboardLoggedOut,
  DashboardSkeleton,
} from "@/components/dashboard/dashboard-states";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function DashboardPage() {
  const { state, reload, toggleTask } = useDashboardData();

  return (
    <main className="flex-1">
      <ApplicationPageHeader
        title="Dashboard"
        description="Here's what's coming up in your application journey."
      />

      <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
        {state.status === "loading" && <DashboardSkeleton />}

        {state.status === "logged-out" && <DashboardLoggedOut />}

        {state.status === "error" && (
          <DashboardError message={state.message} onRetry={reload} />
        )}

        {state.status === "ready" && (
          <>
            {state.isSample && (
              <p className="rounded-lg bg-(--gold)/25 px-4 py-2 text-sm">
                Showing sample data (NEXT_PUBLIC_USE_SAMPLE_DATA is on).
              </p>
            )}

            <SummaryStats
              applications={state.data.applications}
              tasks={state.data.tasks}
              savedPrograms={state.data.savedPrograms}
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ApplicationTracker applications={state.data.applications} />
              </div>
              <div className="flex flex-col gap-6">
                <UpcomingTasks tasks={state.data.tasks} onToggle={toggleTask} />
                <SavedPrograms programs={state.data.savedPrograms} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
