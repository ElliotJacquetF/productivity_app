import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addSlotNote,
  completeSession,
  createSession,
  pauseSession,
  resumeSession,
  Session,
  SessionSlot,
} from "@/lib/domain/session";
import { loadSessions, saveSessions } from "@/lib/storage/indexedDb";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session_${Math.random().toString(36).slice(2)}`;
}

function orderSessions(sessions: Session[]) {
  return [...sessions].sort((a, b) => b.startedAt - a.startedAt);
}

export function useSessionTimer() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing sessions on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadSessions();
        if (!cancelled) {
          setSessions(orderSessions(stored));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: Session[]) => {
    setSessions(orderSessions(next));
    await saveSessions(next);
  }, []);

  const startSession = useCallback(
    async (payload: { durationMs: number; slots: SessionSlot[] }) => {
      const now = Date.now();
      const newSession = createSession({
        id: generateId(),
        now,
        durationMs: payload.durationMs,
        slots: payload.slots,
      });
      const next = [newSession, ...sessions];
      await persist(next);
      return newSession;
    },
    [sessions, persist],
  );

  const updateSession = useCallback(
    async (updated: Session) => {
      const next = sessions.map((s) => (s.id === updated.id ? updated : s));
      await persist(next);
    },
    [sessions, persist],
  );

  const pause = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId && s.status === "running");
      if (!session) return;
      const updated = pauseSession(session, Date.now());
      await updateSession(updated);
    },
    [sessions, updateSession],
  );

  const resume = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId && s.status === "paused");
      if (!session) return;
      const updated = resumeSession(session, Date.now());
      await updateSession(updated);
    },
    [sessions, updateSession],
  );

  const complete = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId && s.status !== "completed");
      if (!session) return;
      const updated = completeSession(session, Date.now());
      await updateSession(updated);
    },
    [sessions, updateSession],
  );

  const addNote = useCallback(
    async (sessionId: string, slotId: string, note: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;
      const updated = addSlotNote(session, slotId, note);
      await updateSession(updated);
    },
    [sessions, updateSession],
  );

  const activeSession = useMemo(() => sessions.find((s) => s.status === "running" || s.status === "paused") || null, [
    sessions,
  ]);

  const completedSessions = useMemo(() => sessions.filter((s) => s.status === "completed"), [sessions]);

  return {
    sessions,
    activeSession,
    completedSessions,
    loading,
    startSession,
    pause,
    resume,
    complete,
    addNote,
  };
}
