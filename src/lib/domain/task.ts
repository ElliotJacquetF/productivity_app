export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
}

export function addTask(tasks: Task[], payload: { id: string; title: string; description?: string }): Task[] {
  if (!payload.title.trim()) {
    throw new Error("Task title cannot be empty");
  }

  const order = tasks.length ? Math.max(...tasks.map((t) => t.order)) + 1 : 0;

  return [...tasks, { id: payload.id, title: payload.title.trim(), description: payload.description, status: "todo", order }];
}

export function updateTask(tasks: Task[], id: string, updates: Partial<Pick<Task, "title" | "description">>): Task[] {
  return tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : task.title,
        }
      : task,
  );
}

export function toggleTaskStatus(tasks: Task[], id: string, status: TaskStatus): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function reorderTask(tasks: Task[], id: string, targetIndex: number): Task[] {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return tasks;

  const clampedIndex = Math.max(0, Math.min(targetIndex, tasks.length - 1));
  const item = tasks[index];
  const without = tasks.filter((t) => t.id !== id);
  const reordered = [...without.slice(0, clampedIndex), item, ...without.slice(clampedIndex)];

  return reordered.map((task, idx) => ({ ...task, order: idx }));
}
