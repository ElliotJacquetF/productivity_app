/**
 * Note: jsdom doesn't implement IndexedDB, and Vitest doesn't ship one by default.
 * This test is a placeholder to illustrate intended usage; it is skipped to avoid
 * environment errors. To enable, add an IndexedDB shim (e.g., fake-indexeddb) and
 * remove .skip below.
 */
import { describe, it, expect } from "vitest";
import { exportData, importData, saveSessions, saveTasks } from "./indexedDb";
import type { Session } from "@/lib/domain/session";
import type { Task } from "@/lib/domain/task";

describe.skip("indexedDb storage (requires IndexedDB shim)", () => {
  it("round-trips sessions and tasks", async () => {
    const sessions: Session[] = [
      {
        id: "s1",
        status: "completed",
        startedAt: 0,
        durationMs: 1000,
        elapsedMs: 1000,
        slots: [],
      },
    ];
    const tasks: Task[] = [{ id: "t1", title: "Task", status: "todo", order: 0 }];

    await saveSessions(sessions);
    await saveTasks(tasks);

    const exported = await exportData();
    expect(exported.sessions).toHaveLength(1);
    expect(exported.tasks).toHaveLength(1);

    await importData({ sessions: [], tasks: [] });
    const cleared = await exportData();
    expect(cleared.sessions).toHaveLength(0);
    expect(cleared.tasks).toHaveLength(0);
  });
});
