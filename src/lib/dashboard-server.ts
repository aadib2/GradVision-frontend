import { backendFetch, type BackendAuth } from "@/lib/auth/backend-request";
import type {
  Application,
  CalendarEvent,
  DashboardData,
  SavedProgram,
  Task,
} from "@/lib/dashboard";

export class DashboardLoadError extends Error {
  constructor(public status?: number) {
    super("We couldn't load your dashboard. Please try again in a moment.");
    this.name = "DashboardLoadError";
  }
}

async function getList<T>(auth: BackendAuth, path: string): Promise<T[]> {
  let response: Response;
  try {
    response = await backendFetch(auth, path);
  } catch {
    throw new DashboardLoadError();
  }
  if (!response.ok) throw new DashboardLoadError(response.status);
  return (await response.json()) as T[];
}

/** Loads everything the dashboard shows, in parallel (server only). */
export async function fetchDashboardData(auth: BackendAuth): Promise<DashboardData> {
  const id = auth.userId;
  const [applications, tasks, savedPrograms, events] = await Promise.all([
    getList<Application>(auth, `/users/${id}/applications/`),
    getList<Task>(auth, `/users/${id}/tasks/`),
    getList<SavedProgram>(auth, `/users/${id}/saved-programs/`),
    getList<CalendarEvent>(auth, `/users/${id}/calendar/`),
  ]);
  return { applications, tasks, savedPrograms, events };
}
