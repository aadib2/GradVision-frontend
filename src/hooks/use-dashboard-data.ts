"use client";

import { useCallback, useEffect, useState } from "react";

import { getCurrentUserId, getErrorMessage } from "@/lib/api";
import {
  fetchDashboardData,
  SAMPLE_DASHBOARD_DATA,
  setTaskCompleted,
  type DashboardData,
} from "@/lib/dashboard";

const USE_SAMPLE_DATA = process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === "true";

type DashboardState =
  | { status: "loading" }
  | { status: "logged-out" }
  | { status: "error"; message: string }
  | { status: "ready"; data: DashboardData; isSample: boolean };

async function loadDashboard(): Promise<DashboardState> {
  if (USE_SAMPLE_DATA) {
    return { status: "ready", data: SAMPLE_DASHBOARD_DATA, isSample: true };
  }

  const userId = getCurrentUserId();
  if (userId === null) return { status: "logged-out" };

  try {
    const data = await fetchDashboardData(userId);
    return { status: "ready", data, isSample: false };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadDashboard().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    setState({ status: "loading" });
    setState(await loadDashboard());
  }, []);

  /** Check or uncheck a task. Updates the screen right away, then saves. */
  const toggleTask = useCallback(
    async (taskId: number, completed: boolean) => {
      const update = (done: boolean) =>
        setState((prev) =>
          prev.status === "ready"
            ? {
                ...prev,
                data: {
                  ...prev.data,
                  tasks: prev.data.tasks.map((task) =>
                    task.task_id === taskId ? { ...task, completed: done } : task,
                  ),
                },
              }
            : prev,
        );

      update(completed);
      if (USE_SAMPLE_DATA) return;

      try {
        await setTaskCompleted(taskId, completed);
      } catch {
        update(!completed); // undo if saving failed
      }
    },
    [],
  );

  return { state, reload, toggleTask };
}
