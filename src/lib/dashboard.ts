// Dashboard types and helpers. Safe to import from client components.
// Types match the backend schemas (app/schemas/applications.py, programs.py).

export type ApplicationStatus =
  | "not started"
  | "in progress"
  | "submitted"
  | "accepted"
  | "rejected";

export type Application = {
  application_id: number;
  user_id: number;
  program_id: number;
  program_name: string;
  university_name: string;
  status: ApplicationStatus;
  transcripts_done: boolean;
  recommendations_done: boolean;
  statement_done: boolean;
  test_scores_done: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  task_id: number;
  user_id: number;
  application_id: number | null;
  title: string;
  due_date: string | null;
  completed: boolean;
};

export type SavedProgram = {
  program_id: number;
  program_name: string;
  degree_type: "Masters" | "PhD" | "Combined";
  university_name: string;
  program_start: number | null;
  program_end: number | null;
};

export type CalendarEvent = {
  event_id: number;
  program_id: number;
  label: string;
  event_type: string;
  event_date: string;
};

export type DashboardData = {
  applications: Application[];
  tasks: Task[];
  savedPrograms: SavedProgram[];
  events: CalendarEvent[];
};

/** The four checklist items stored on each application. */
export const APPLICATION_STEPS = [
  { key: "transcripts_done", label: "Transcripts" },
  { key: "recommendations_done", label: "Recommendations" },
  { key: "statement_done", label: "Statement of purpose" },
  { key: "test_scores_done", label: "Test scores" },
] as const;

/** Percent of checklist items done (0-100). */
export function applicationProgress(app: Application): number {
  const done = APPLICATION_STEPS.filter((step) => app[step.key]).length;
  return Math.round((done / APPLICATION_STEPS.length) * 100);
}

/** Label for the first unfinished checklist item. */
export function nextStep(app: Application): string {
  if (app.status === "submitted") return "Wait for a decision";
  if (app.status === "accepted") return "Review your offer";
  if (app.status === "rejected") return "Look at other programs";

  const step = APPLICATION_STEPS.find((item) => !app[item.key]);
  return step ? `Finish ${step.label.toLowerCase()}` : "Submit your application";
}

export type Tone = "green" | "blue" | "gold" | "red";

export function statusBadge(status: ApplicationStatus): { label: string; tone: Tone } {
  switch (status) {
    case "submitted":
      return { label: "Submitted", tone: "green" };
    case "accepted":
      return { label: "Accepted", tone: "green" };
    case "rejected":
      return { label: "Rejected", tone: "red" };
    case "in progress":
      return { label: "In progress", tone: "blue" };
    default:
      return { label: "Not started", tone: "gold" };
  }
}

/** Progress bar color: green when nearly done, blue in the middle, gold when behind. */
export function progressTone(percent: number): Tone {
  if (percent >= 75) return "green";
  if (percent >= 40) return "blue";
  return "gold";
}

/** Parses "2026-12-01" or "2026-12-01T00:00:00" as a local calendar date. */
export function parseDate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatShortDate(value: string): string {
  return parseDate(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

/** Events from today on, soonest first. */
export function upcomingEvents(events: CalendarEvent[]): CalendarEvent[] {
  const today = startOfToday();
  return events
    .filter((event) => parseDate(event.event_date) >= today)
    .sort((a, b) => parseDate(a.event_date).getTime() - parseDate(b.event_date).getTime());
}

/** A program's upcoming application deadline, or else its soonest upcoming event. */
export function nextEventForProgram(
  events: CalendarEvent[],
  programId: number,
): CalendarEvent | undefined {
  const forProgram = upcomingEvents(events).filter((event) => event.program_id === programId);
  return (
    forProgram.find((event) => /application/i.test(event.label)) ?? forProgram[0]
  );
}

/** program_id -> university name, from applications and saved programs. */
export function universityByProgram(data: DashboardData): Map<number, string> {
  const map = new Map<number, string>();
  for (const program of data.savedPrograms) map.set(program.program_id, program.university_name);
  for (const app of data.applications) map.set(app.program_id, app.university_name);
  return map;
}

/** Sample data (from the Figma) so the page can be shown without the backend. */
export const SAMPLE_DASHBOARD_DATA: DashboardData = {
  applications: [
    {
      application_id: 1,
      user_id: 1,
      program_id: 1,
      program_name: "Human–Computer Interaction",
      university_name: "University of Chicago",
      status: "submitted",
      transcripts_done: true,
      recommendations_done: true,
      statement_done: true,
      test_scores_done: false,
      notes: null,
      created_at: "2026-09-01T00:00:00",
      updated_at: "2026-11-01T00:00:00",
    },
    {
      application_id: 2,
      user_id: 1,
      program_id: 2,
      program_name: "Cognitive Science",
      university_name: "UC San Diego",
      status: "in progress",
      transcripts_done: true,
      recommendations_done: true,
      statement_done: false,
      test_scores_done: false,
      notes: null,
      created_at: "2026-09-10T00:00:00",
      updated_at: "2026-11-05T00:00:00",
    },
    {
      application_id: 3,
      user_id: 1,
      program_id: 3,
      program_name: "Information Studies",
      university_name: "UCLA",
      status: "not started",
      transcripts_done: true,
      recommendations_done: false,
      statement_done: false,
      test_scores_done: false,
      notes: null,
      created_at: "2026-10-01T00:00:00",
      updated_at: "2026-10-20T00:00:00",
    },
  ],
  tasks: [
    { task_id: 1, user_id: 1, application_id: 2, title: "Draft CS statement of purpose", due_date: "2026-11-22T00:00:00", completed: false },
    { task_id: 2, user_id: 1, application_id: null, title: "Request recommendation · Dr. Lee", due_date: "2026-11-26T00:00:00", completed: false },
    { task_id: 3, user_id: 1, application_id: 3, title: "Review UCLA faculty list", due_date: "2026-12-03T00:00:00", completed: false },
  ],
  savedPrograms: [
    { program_id: 4, program_name: "Computer Science", degree_type: "PhD", university_name: "Stanford", program_start: 2027, program_end: 2032 },
    { program_id: 1, program_name: "Human–Computer Interaction", degree_type: "PhD", university_name: "University of Chicago", program_start: 2027, program_end: 2032 },
    { program_id: 2, program_name: "Cognitive Science", degree_type: "PhD", university_name: "UC San Diego", program_start: 2027, program_end: 2032 },
    { program_id: 3, program_name: "Information Studies", degree_type: "PhD", university_name: "UCLA", program_start: 2027, program_end: 2032 },
  ],
  events: [
    { event_id: 1, program_id: 1, label: "Statement review", event_type: "deadline", event_date: "2026-11-25" },
    { event_id: 2, program_id: 2, label: "Portfolio draft", event_type: "deadline", event_date: "2026-12-02" },
    { event_id: 3, program_id: 3, label: "Recommendation check-in", event_type: "deadline", event_date: "2026-12-10" },
    { event_id: 4, program_id: 4, label: "Priority deadline", event_type: "deadline", event_date: "2026-12-15" },
    { event_id: 5, program_id: 1, label: "Application deadline", event_type: "deadline", event_date: "2026-12-15" },
    { event_id: 6, program_id: 2, label: "Application deadline", event_type: "deadline", event_date: "2026-12-06" },
    { event_id: 7, program_id: 3, label: "Application deadline", event_type: "deadline", event_date: "2026-12-01" },
  ],
};
