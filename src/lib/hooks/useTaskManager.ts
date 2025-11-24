import { useCallback, useEffect, useMemo, useState } from "react";
import { addTask, removeTask, reorderTask, Task, toggleTaskStatus, updateTask } from "@/lib/domain/task";
import { loadTasks, saveTasks } from "@/lib/storage/indexedDb";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task_${Math.random().toString(36).slice(2)}`;
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadTasks();
        if (!cancelled) {
          setTasks(stored);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: Task[]) => {
    setTasks(next);
    await saveTasks(next);
  }, []);

  const createTask = useCallback(
    async (payload: { title: string; description?: string }) => {
      const next = addTask(tasks, { id: generateId(), title: payload.title, description: payload.description });
      await persist(next);
    },
    [tasks, persist],
  );

  const editTask = useCallback(
    async (id: string, updates: { title?: string; description?: string }) => {
      const next = updateTask(tasks, id, updates);
      await persist(next);
    },
    [tasks, persist],
  );

  const setTaskStatus = useCallback(
    async (id: string, status: Task["status"]) => {
      const next = toggleTaskStatus(tasks, id, status);
      await persist(next);
    },
    [tasks, persist],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const next = removeTask(tasks, id);
      await persist(next);
    },
    [tasks, persist],
  );

  const moveTask = useCallback(
    async (id: string, targetIndex: number) => {
      const next = reorderTask(tasks, id, targetIndex);
      await persist(next);
    },
    [tasks, persist],
  );

  const { todoTasks, doneTasks } = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => a.order - b.order);
    return {
      todoTasks: sorted.filter((t) => t.status === "todo"),
      doneTasks: sorted.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  return {
    tasks,
    todoTasks,
    doneTasks,
    loading,
    createTask,
    editTask,
    setTaskStatus,
    deleteTask,
    moveTask,
  };
}
