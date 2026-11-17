"use client";

import { useId, useState } from "react";

import {
  CardHeading,
  DashboardCard,
  primaryButton,
} from "@/components/dashboard/dashboard-ui";
import { EmptyState } from "@/components/states/empty-state";
import { Spinner } from "@/components/states/loading-state";
import { formatShortDate, parseDate, type Task } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

const MAX_TASKS_SHOWN = 5;

function sortTasks(tasks: Task[]): Task[] {
  const time = (task: Task) =>
    task.due_date ? parseDate(task.due_date).getTime() : Number.POSITIVE_INFINITY;
  return [...tasks].sort(
    (a, b) => Number(a.completed) - Number(b.completed) || time(a) - time(b),
  );
}

export function TasksCard({
  initialTasks,
  isSample,
}: {
  initialTasks: Task[];
  isSample: boolean;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formId = useId();

  const setCompleted = (taskId: number, completed: boolean) =>
    setTasks((prev) =>
      prev.map((task) => (task.task_id === taskId ? { ...task, completed } : task)),
    );

  async function toggle(task: Task) {
    const completed = !task.completed;
    setError(null);
    setCompleted(task.task_id, completed); // update the screen right away
    if (isSample) return;

    try {
      const response = await fetch(`/api/tasks/${task.task_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error();
    } catch {
      setCompleted(task.task_id, !completed); // undo if saving failed
      setError("Couldn't save that change. Please try again.");
    }
  }

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);

    if (isSample) {
      const fakeId = Math.max(0, ...tasks.map((t) => t.task_id)) + 1;
      setTasks((prev) => [
        ...prev,
        { task_id: fakeId, user_id: 1, application_id: null, title: trimmed, due_date: dueDate || null, completed: false },
      ]);
      setTitle("");
      setDueDate("");
      setAdding(false);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed, due_date: dueDate || null }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.task) {
        throw new Error(data?.error ?? "Couldn't add the task.");
      }
      setTasks((prev) => [...prev, data.task as Task]);
      setTitle("");
      setDueDate("");
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the task.");
    } finally {
      setSaving(false);
    }
  }

  const shown = sortTasks(tasks).slice(0, MAX_TASKS_SHOWN);

  return (
    <DashboardCard aria-labelledby="tasks-title">
      <CardHeading
        id="tasks-title"
        title="Tasks"
        action={
          <button
            type="button"
            className={cn(primaryButton, "text-[10px]")}
            aria-expanded={adding}
            aria-controls={formId}
            onClick={() => setAdding((open) => !open)}
          >
            {adding ? "Cancel" : "+ Add task"}
          </button>
        }
      />

      {adding && (
        <form id={formId} onSubmit={addTask} className="mb-3 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`${formId}-title`}>
            Task
          </label>
          <input
            id={`${formId}-title`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            required
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-[#a9bac3] bg-white px-2 py-1.5 text-xs"
          />
          <label className="sr-only" htmlFor={`${formId}-date`}>
            Due date
          </label>
          <input
            id={`${formId}-date`}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-[#a9bac3] bg-white px-2 py-1.5 text-xs"
          />
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? <Spinner label="Saving…" /> : "Save"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mb-2 text-xs text-[var(--burgundy)]">
          {error}
        </p>
      )}

      {shown.length === 0 ? (
        <EmptyState text="No tasks yet. Add your first one." />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {shown.map((task) => (
            <li key={task.task_id}>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggle(task)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[3px] accent-[var(--blue)]"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[11px]",
                      task.completed && "text-[#667985] line-through",
                    )}
                  >
                    {task.title}
                  </span>
                  {task.due_date && (
                    <span className="block text-[9px] text-[#a46a2a]">
                      Due {formatShortDate(task.due_date)}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
