export type SessionStatus = "running" | "paused" | "completed";

export type SessionSlotKind = "work" | "break";

export interface SessionSlot {
  id: string;
  kind: SessionSlotKind;
  plannedStartOffsetMs: number;
  plannedDurationMs: number;
  notes: string[];
}

export interface Session {
  id: string;
  status: SessionStatus;
  startedAt: number;
  durationMs: number;
  elapsedMs: number;
  lastResumedAt?: number;
  slots: SessionSlot[];
}

export interface CreateSessionInput {
  id: string;
  now: number;
  durationMs: number;
  slots: SessionSlot[];
}

export function createSession(input: CreateSessionInput): Session {
  if (input.durationMs <= 0) {
    throw new Error("Session duration must be positive");
  }

  return {
    id: input.id,
    status: "running",
    startedAt: input.now,
    durationMs: input.durationMs,
    elapsedMs: 0,
    lastResumedAt: input.now,
    slots: input.slots,
  };
}

export function pauseSession(session: Session, now: number): Session {
  if (session.status !== "running") {
    throw new Error("Can only pause a running session");
  }

  const elapsed = session.elapsedMs + (session.lastResumedAt ? now - session.lastResumedAt : 0);

  return {
    ...session,
    status: "paused",
    elapsedMs: elapsed,
    lastResumedAt: undefined,
  };
}

export function resumeSession(session: Session, now: number): Session {
  if (session.status !== "paused") {
    throw new Error("Can only resume a paused session");
  }

  return {
    ...session,
    status: "running",
    lastResumedAt: now,
  };
}

export function completeSession(session: Session, now: number): Session {
  if (session.status === "completed") {
    return session;
  }

  const elapsed =
    session.status === "running" && session.lastResumedAt
      ? session.elapsedMs + (now - session.lastResumedAt)
      : session.elapsedMs;

  return {
    ...session,
    status: "completed",
    elapsedMs: elapsed,
    lastResumedAt: undefined,
  };
}

export function addSlotNote(session: Session, slotId: string, note: string): Session {
  if (!note.trim()) return session;

  const slots = session.slots.map((slot) =>
    slot.id === slotId ? { ...slot, notes: [...slot.notes, note.trim()] } : slot,
  );

  return { ...session, slots };
}
