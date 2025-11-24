import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useTaskManager } from "./useTaskManager";
import * as storage from "@/lib/storage/indexedDb";

vi.mock("@/lib/storage/indexedDb", () => {
  const mockTasks = [
    { id: "t1", title: "Task 1", status: "todo" as const, order: 0 },
    { id: "t2", title: "Task 2", status: "todo" as const, order: 1 },
  ];
  return {
    loadTasks: vi.fn().mockResolvedValue(mockTasks),
    saveTasks: vi.fn().mockResolvedValue(undefined),
  };
});

describe("useTaskManager", () => {
  it("loads tasks and allows creation", async () => {
    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toHaveLength(2);

    await act(async () => {
      await result.current.createTask({ title: "New Task" });
    });

    expect(result.current.tasks).toHaveLength(3);
    expect((storage.saveTasks as any).mock.calls.length).toBeGreaterThan(0);
  });

  it("toggles status and reorders", async () => {
    const { result } = renderHook(() => useTaskManager());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.setTaskStatus("t1", "done");
    });
    expect(result.current.doneTasks.some((t) => t.id === "t1")).toBe(true);

    await act(async () => {
      await result.current.moveTask("t2", 0);
    });
    expect(result.current.tasks[0].id).toBe("t2");
  });
});
