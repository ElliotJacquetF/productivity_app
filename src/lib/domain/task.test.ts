import { addTask, removeTask, reorderTask, toggleTaskStatus, updateTask } from "./task";

describe("task domain", () => {
  it("adds a task with incremental order", () => {
    const tasks = addTask([], { id: "t1", title: "Task 1" });
    const more = addTask(tasks, { id: "t2", title: "Task 2" });

    expect(more).toHaveLength(2);
    expect(more[0].order).toBe(0);
    expect(more[1].order).toBe(1);
  });

  it("updates task fields", () => {
    const tasks = addTask([], { id: "t1", title: "Old" });
    const updated = updateTask(tasks, "t1", { title: "New", description: "Desc" });

    expect(updated[0].title).toBe("New");
    expect(updated[0].description).toBe("Desc");
  });

  it("toggles status", () => {
    const tasks = addTask([], { id: "t1", title: "Task" });
    const toggled = toggleTaskStatus(tasks, "t1", "done");
    expect(toggled[0].status).toBe("done");
  });

  it("removes a task", () => {
    const tasks = [addTask([], { id: "t1", title: "Task" })[0]];
    const remaining = removeTask(tasks, "t1");
    expect(remaining).toHaveLength(0);
  });

  it("reorders tasks", () => {
    const tasks = [
      { id: "a", title: "A", status: "todo" as const, order: 0 },
      { id: "b", title: "B", status: "todo" as const, order: 1 },
      { id: "c", title: "C", status: "todo" as const, order: 2 },
    ];

    const reordered = reorderTask(tasks, "a", 2);
    expect(reordered.map((t) => t.id)).toEqual(["b", "c", "a"]);
    expect(reordered[2].order).toBe(2);
  });
});
