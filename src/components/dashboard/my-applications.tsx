"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleArrowRight, Check, Circle } from "lucide-react";

import {
  DashboardCard,
  muted,
  primaryButton,
  ProgressBar,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import {
  APPLICATION_STEPS,
  applicationProgress,
  formatShortDate,
  nextEventForProgram,
  nextStep,
  progressTone,
  statusBadge,
  type Application,
  type CalendarEvent,
} from "@/lib/dashboard";
import { EmptyState } from "@/components/states/empty-state";
import { cn } from "@/lib/utils";

function ApplicationCard({
  app,
  events,
}: {
  app: Application;
  events: CalendarEvent[];
}) {
  const [showChecklist, setShowChecklist] = useState(false);
  const percent = applicationProgress(app);
  const badge = statusBadge(app.status);
  const deadline = nextEventForProgram(events, app.program_id);
  const checklistId = `checklist-${app.application_id}`;

  return (
    <li className="flex flex-col rounded-[14px] border border-[#a9bac3] bg-[#fffcf4] p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-lora)] text-[19px] leading-tight">
            {app.university_name}
          </h3>
          <p className="mt-1 text-xs font-bold">{app.program_name}</p>
        </div>
        <StatusBadge {...badge} />
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-[10px]">
          <span className={muted}>Application completeness</span>
          <span className="font-extrabold">{percent}%</span>
        </div>
        <ProgressBar
          value={percent}
          tone={progressTone(percent)}
          label={`${app.university_name} application completeness`}
          className="h-1.5"
        />
      </div>

      <p className={cn("mt-4 flex items-center gap-2 text-[10px]", muted)}>
        <CircleArrowRight className="size-[13px] shrink-0" aria-hidden />
        Next: {nextStep(app)}
      </p>

      {showChecklist && (
        <ul id={checklistId} className="mt-3 flex flex-col gap-1.5 text-[11px]">
          {APPLICATION_STEPS.map((step) => {
            const done = app[step.key];
            return (
              <li key={step.key} className="flex items-center gap-2">
                {done ? (
                  <Check className="size-3.5 text-[#4e755f]" aria-hidden />
                ) : (
                  <Circle className="size-3.5 text-[#a9bac3]" aria-hidden />
                )}
                <span className={cn(done && "text-[#667985] line-through")}>
                  {step.label}
                </span>
                <span className="sr-only">{done ? "(done)" : "(not done)"}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <p className={cn("text-[9px]", muted)}>{deadline?.label ?? "Deadline"}</p>
          <p className="text-xs font-extrabold">
            {deadline ? formatShortDate(deadline.event_date) : "Not set"}
          </p>
        </div>
        <button
          type="button"
          className={cn(
            primaryButton,
            "border border-[var(--blue)] bg-transparent text-[10px] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white",
          )}
          aria-expanded={showChecklist}
          aria-controls={checklistId}
          onClick={() => setShowChecklist((open) => !open)}
        >
          {showChecklist ? "Hide checklist" : "Checklist"}
        </button>
      </div>
    </li>
  );
}

export function MyApplications({
  applications,
  events,
}: {
  applications: Application[];
  events: CalendarEvent[];
}) {
  return (
    <DashboardCard aria-labelledby="applications-title">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="applications-title"
            className="font-[family-name:var(--font-lora)] text-[23px] leading-tight"
          >
            My applications
          </h2>
          <p className={cn("mt-1 text-[11px]", muted)}>
            Track materials, deadlines, and next actions.
          </p>
        </div>
        <Link href="/explore" className={primaryButton}>
          + Add application
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          text="You haven't started any applications yet."
          href="/explore"
          linkLabel="Find a program in Explore"
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard key={app.application_id} app={app} events={events} />
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
