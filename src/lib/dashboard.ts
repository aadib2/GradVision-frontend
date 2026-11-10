import api from "@/lib/api";

// These types match the backend schemas in GradVision-backend
// (app/schemas/applications.py and app/schemas/programs.py).

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

export type DashboardData = {
  applications: Application[];
  tasks: Task[];
  savedPrograms: SavedProgram[];
};

export async function fetchDashboardData(userId: number): Promise<DashboardData> {
  const [applications, tasks, savedPrograms] = await Promise.all([
    api.get<Application[]>(`/users/${userId}/applications/`),
    api.get<Task[]>(`/users/${userId}/tasks/`),
    api.get<SavedProgram[]>(`/users/${userId}/saved-programs/`),
  ]);

  return {
    applications: applications.data,
    tasks: tasks.data,
    savedPrograms: savedPrograms.data,
  };
}

export async function setTaskCompleted(
  taskId: number,
  completed: boolean,
): Promise<void> {
  await api.patch(`/tasks/${taskId}`, { completed });
}

/** The four checklist items stored on each application. */
export const APPLICATION_STEPS = [
  { key: "transcripts_done", label: "Transcripts" },
  { key: "recommendations_done", label: "Recommendations" },
  { key: "statement_done", label: "Statement of purpose" },
  { key: "test_scores_done", label: "Test scores" },
] as const;

export function applicationProgress(app: Application): number {
  const done = APPLICATION_STEPS.filter((step) => app[step.key]).length;
  return (done / APPLICATION_STEPS.length) * 100;
}

/** Sample data so the page can be shown before login is wired up. */
export const SAMPLE_DASHBOARD_DATA: DashboardData = {
  applications: [
    {
      application_id: 1,
      user_id: 1,
      program_id: 1,
      program_name: "PhD in Electrical and Computer Engineering",
      university_name: "UC San Diego",
      status: "in progress",
      transcripts_done: true,
      recommendations_done: true,
      statement_done: false,
      test_scores_done: false,
      notes: null,
      created_at: "2026-10-01T00:00:00",
      updated_at: "2026-11-01T00:00:00",
    },
    {
      application_id: 2,
      user_id: 1,
      program_id: 2,
      program_name: "MS in Robotics",
      university_name: "Georgia Tech",
      status: "not started",
      transcripts_done: false,
      recommendations_done: false,
      statement_done: false,
      test_scores_done: false,
      notes: null,
      created_at: "2026-10-05T00:00:00",
      updated_at: "2026-10-05T00:00:00",
    },
    {
      application_id: 3,
      user_id: 1,
      program_id: 3,
      program_name: "PhD in Mechanical Engineering",
      university_name: "UCLA",
      status: "submitted",
      transcripts_done: true,
      recommendations_done: true,
      statement_done: true,
      test_scores_done: true,
      notes: null,
      created_at: "2026-09-20T00:00:00",
      updated_at: "2026-11-03T00:00:00",
    },
  ],
  tasks: [
    { task_id: 1, user_id: 1, application_id: 1, title: "Finish statement of purpose draft", due_date: "2026-11-20T00:00:00", completed: false },
    { task_id: 2, user_id: 1, application_id: null, title: "Email professor about research fit", due_date: "2026-11-14T00:00:00", completed: false },
    { task_id: 3, user_id: 1, application_id: 2, title: "Request transcripts", due_date: "2026-12-01T00:00:00", completed: false },
    { task_id: 4, user_id: 1, application_id: 1, title: "Ask for recommendation letters", due_date: "2026-11-01T00:00:00", completed: true },
  ],
  savedPrograms: [
    { program_id: 4, program_name: "PhD in Robotics", degree_type: "PhD", university_name: "Carnegie Mellon University", program_start: 2027, program_end: 2032 },
    { program_id: 5, program_name: "MS in Computer Engineering", degree_type: "Masters", university_name: "San Diego State University", program_start: 2027, program_end: 2029 },
  ],
};
