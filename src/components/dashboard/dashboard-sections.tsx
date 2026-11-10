import { Bookmark, CalendarClock, Check, FileText, Send } from "lucide-react";

import { EmptyState } from "@/components/dashboard/dashboard-states";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  APPLICATION_STEPS,
  applicationProgress,
  type Application,
  type ApplicationStatus,
  type SavedProgram,
  type Task,
} from "@/lib/dashboard";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  "not started": "border-(--gray) bg-transparent text-(--blue)",
  "in progress": "border-transparent bg-(--gold)/40 text-(--blue)",
  submitted: "border-transparent bg-(--blue) text-(--white)",
  accepted: "border-transparent bg-green-700 text-white",
  rejected: "border-transparent bg-(--burgundy) text-(--white)",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysUntil(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(value);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/* ---------- Summary numbers ---------- */

export function SummaryStats({
  applications,
  tasks,
  savedPrograms,
}: {
  applications: Application[];
  tasks: Task[];
  savedPrograms: SavedProgram[];
}) {
  const submitted = applications.filter((a) =>
    ["submitted", "accepted", "rejected"].includes(a.status),
  ).length;
  const openTasks = tasks.filter((t) => !t.completed).length;

  const stats = [
    { label: "Applications", value: applications.length, icon: FileText },
    { label: "Submitted", value: submitted, icon: Send },
    { label: "Open tasks", value: openTasks, icon: CalendarClock },
    { label: "Saved programs", value: savedPrograms.length, icon: Bookmark },
  ];

  return (
    <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <li
          key={label}
          className="flex items-center gap-3 rounded-xl border border-(--blue)/20 bg-(--cream) p-4"
        >
          <Icon className="size-6 shrink-0" aria-hidden />
          <div>
            <p className="font-serif text-3xl leading-none font-bold">{value}</p>
            <p className="mt-1 text-sm">{label}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Application tracker ---------- */

export function ApplicationTracker({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>My applications</CardTitle>
          <CardDescription>Track each step of every application.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <EmptyState
            text="You haven't started any applications yet."
            href="/explore"
            linkLabel="Find programs on Explore"
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {applications.map((app) => {
              const progress = applicationProgress(app);
              return (
                <li
                  key={app.application_id}
                  className="rounded-lg border border-(--blue)/15 bg-(--white) p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{app.program_name}</p>
                      <p className="text-sm">{app.university_name}</p>
                    </div>
                    <Badge className={cn("capitalize", STATUS_STYLES[app.status])}>
                      {app.status}
                    </Badge>
                  </div>

                  <Progress
                    className="mt-3"
                    value={progress}
                    label={`${app.program_name} checklist progress`}
                  />

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {APPLICATION_STEPS.map((step) => {
                      const done = app[step.key];
                      return (
                        <li key={step.key}>
                          <Badge variant={done ? "secondary" : "outline"}>
                            {done && <Check className="size-3" aria-hidden />}
                            {step.label}
                            <span className="sr-only">{done ? " (done)" : " (not done)"}</span>
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------- Upcoming deadlines / tasks ---------- */

export function UpcomingTasks({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (taskId: number, completed: boolean) => void;
}) {
  // Open tasks first, soonest due date first; tasks without a date go last.
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Upcoming deadlines</CardTitle>
          <CardDescription>Your to-do list, soonest first.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState text="No tasks yet. You're all caught up!" />
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map((task) => {
              const days = task.due_date ? daysUntil(task.due_date) : null;
              const overdue = !task.completed && days !== null && days < 0;
              const soon = !task.completed && days !== null && days >= 0 && days <= 7;

              return (
                <li key={task.task_id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-(--white)">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-(--blue)"
                      checked={task.completed}
                      onChange={(e) => onToggle(task.task_id, e.target.checked)}
                    />
                    <span className="flex-1">
                      <span className={cn("block", task.completed && "line-through opacity-60")}>
                        {task.title}
                      </span>
                      {task.due_date && (
                        <span
                          className={cn(
                            "text-xs",
                            overdue && "font-bold text-(--burgundy)",
                            soon && "font-bold",
                          )}
                        >
                          {overdue ? "Overdue · " : soon ? "Due soon · " : "Due "}
                          {formatDate(task.due_date)}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------- Saved programs ---------- */

export function SavedPrograms({ programs }: { programs: SavedProgram[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Saved programs</CardTitle>
          <CardDescription>Programs you bookmarked on Explore.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {programs.length === 0 ? (
          <EmptyState
            text="You haven't saved any programs yet."
            href="/explore"
            linkLabel="Browse programs"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {programs.map((program) => (
              <li
                key={program.program_id}
                className="flex items-start justify-between gap-2 rounded-lg border border-(--blue)/15 bg-(--white) p-3"
              >
                <div>
                  <p className="font-bold">{program.program_name}</p>
                  <p className="text-sm">{program.university_name}</p>
                </div>
                <Badge variant="secondary">{program.degree_type}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
