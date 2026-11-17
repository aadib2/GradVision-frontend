import Link from "next/link";
import { BookOpen, FileText, Landmark, UserRound } from "lucide-react";

import {
  CardHeading,
  DashboardCard,
  muted,
  ProgressBar,
} from "@/components/dashboard/dashboard-ui";
import {
  applicationProgress,
  formatShortDate,
  universityByProgram,
  upcomingEvents,
  type DashboardData,
} from "@/lib/dashboard";
import { EmptyState } from "@/components/states/empty-state";
import { cn } from "@/lib/utils";

export function WelcomeHeader({ firstName }: { firstName: string }) {
  return (
    <header className="border-b border-[#a9bac3] bg-[#fffcf4] px-4 py-8 md:px-8">
      <h1 className="text-[31px] leading-tight font-normal">
        Welcome back{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className={cn("mt-2 text-sm", muted)}>
        Here&rsquo;s what&rsquo;s coming up in your application journey.
      </p>
    </header>
  );
}

export function ApplicationProgress({ data }: { data: DashboardData }) {
  return (
    <DashboardCard aria-labelledby="progress-title">
      <CardHeading
        id="progress-title"
        title="Application progress"
        subtitle="Across your active school list"
      />
      {data.applications.length === 0 ? (
        <EmptyState
          text="No applications yet. Start one to track your progress."
          href="/explore"
          linkLabel="Find programs"
        />
      ) : (
        <ul className="flex flex-col gap-3.5">
          {data.applications.map((app) => {
            const percent = applicationProgress(app);
            return (
              <li
                key={app.application_id}
                className="grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] items-center gap-3"
              >
                <span className="truncate text-xs font-semibold" title={app.university_name}>
                  {app.university_name}
                </span>
                <ProgressBar value={percent} label={`${app.university_name} progress`} />
                <span className="text-right text-[11px] font-bold">{percent}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export function UpcomingDeadlines({ data }: { data: DashboardData }) {
  const universities = universityByProgram(data);
  const events = upcomingEvents(data.events).slice(0, 4);

  return (
    <DashboardCard aria-labelledby="deadlines-title">
      <CardHeading id="deadlines-title" title="Upcoming deadlines" />
      {events.length === 0 ? (
        <EmptyState text="No upcoming deadlines. Save a program to see its dates here." />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {events.map((event) => (
            <li key={event.event_id} className="flex items-center gap-3">
              <time
                dateTime={event.event_date}
                className="flex h-[38px] w-[55px] shrink-0 items-center justify-center rounded-md bg-[#f4e6cc] text-[10px] font-extrabold text-[#a46a2a] uppercase"
              >
                {formatShortDate(event.event_date)}
              </time>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{event.label}</p>
                <p className={cn("truncate text-[10px]", muted)}>
                  {universities.get(event.program_id) ?? event.event_type}
                </p>
              </div>
              <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-[#a46a2a]" />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function SavedResearch({ data }: { data: DashboardData }) {
  // The backend only stores saved programs for now; the other counts are 0
  // until saving professors, resources and papers is added.
  const categories = [
    { label: "Programs", count: data.savedPrograms.length, icon: Landmark },
    { label: "Professors", count: 0, icon: UserRound },
    { label: "Resources", count: 0, icon: BookOpen },
    { label: "Papers", count: 0, icon: FileText },
  ];

  return (
    <DashboardCard aria-labelledby="saved-title">
      <CardHeading
        id="saved-title"
        title="Saved research"
        action={
          <Link href="/explore" className="text-[11px] font-bold hover:underline">
            Open library &rarr;
          </Link>
        }
      />
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {categories.map(({ label, count, icon: Icon }) => (
          <li
            key={label}
            className="flex min-h-[130px] flex-col rounded-[10px] border border-[#a9bac3] bg-[#f8f3e5] p-3.5"
          >
            <Icon className="size-[18px]" aria-hidden />
            <span className="mt-2 font-[family-name:var(--font-lora)] text-[26px]">{count}</span>
            <span className={cn("mt-1 text-[11px] font-bold", muted)}>{label}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
