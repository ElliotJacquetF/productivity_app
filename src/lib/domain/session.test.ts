import {
  addSlotNote,
  completeSession,
  createSession,
  pauseSession,
  resumeSession,
  Session,
  SessionSlot,
} from "./session";

const baseSlots: SessionSlot[] = [
  { id: "w1", kind: "work", plannedStartOffsetMs: 0, plannedDurationMs: 25 * 60 * 1000, notes: [] },
  { id: "b1", kind: "break", plannedStartOffsetMs: 25 * 60 * 1000, plannedDurationMs: 5 * 60 * 1000, notes: [] },
];

describe("session domain", () => {
  const now = 1_000_000;

  it("creates a running session", () => {
    const session = createSession({ id: "s1", now, durationMs: 30 * 60 * 1000, slots: baseSlots });

    expect(session.status).toBe("running");
    expect(session.elapsedMs).toBe(0);
    expect(session.lastResumedAt).toBe(now);
  });

  it("pauses and resumes while tracking elapsed time", () => {
    let session = createSession({ id: "s1", now, durationMs: 30 * 60 * 1000, slots: baseSlots });

    session = pauseSession(session, now + 1_000); // +1s
    expect(session.status).toBe("paused");
    expect(session.elapsedMs).toBe(1_000);

    session = resumeSession(session, now + 2_000);
    expect(session.status).toBe("running");
    expect(session.lastResumedAt).toBe(now + 2_000);

    const completed = completeSession(session, now + 3_000); // +1s more
    expect(completed.status).toBe("completed");
    expect(completed.elapsedMs).toBe(2_000); // 1s before pause + 1s after resume
  });

  it("adds notes to a slot", () => {
    const session = createSession({ id: "s1", now, durationMs: 30 * 60 * 1000, slots: baseSlots });
    const updated = addSlotNote(session, "w1", "Worked on Task A");

    expect(updated.slots.find((s) => s.id === "w1")?.notes).toContain("Worked on Task A");
  });
});
