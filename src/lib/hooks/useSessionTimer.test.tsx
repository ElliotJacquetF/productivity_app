import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import { useSessionTimer } from "./useSessionTimer";
import * as storage from "@/lib/storage/indexedDb";
import { SessionSlot } from "@/lib/domain/session";

const slots: SessionSlot[] = [
  { id: "w1", kind: "work", plannedStartOffsetMs: 0, plannedDurationMs: 1000, notes: [] },
  { id: "b1", kind: "break", plannedStartOffsetMs: 1000, plannedDurationMs: 300, notes: [] },
];

vi.mock("@/lib/storage/indexedDb", () => {
  const mockSessions: any[] = [];
  return {
    loadSessions: vi.fn().mockResolvedValue(mockSessions),
    saveSessions: vi.fn().mockResolvedValue(undefined),
  };
});

describe("useSessionTimer", () => {
  it("starts, pauses, resumes, completes a session", async () => {
    const { result } = renderHook(() => useSessionTimer());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.startSession({ durationMs: 1300, slots });
    });

    expect(result.current.activeSession).not.toBeNull();

    const sessionId = result.current.activeSession!.id;

    await act(async () => {
      await result.current.pause(sessionId);
      await result.current.resume(sessionId);
      await result.current.complete(sessionId);
    });

    expect(result.current.completedSessions.length).toBe(1);
    expect((storage.saveSessions as any).mock.calls.length).toBeGreaterThan(0);
  });

  it("adds slot notes", async () => {
    const { result } = renderHook(() => useSessionTimer());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.startSession({ durationMs: 1300, slots });
    });
    const sessionId = result.current.activeSession!.id;

    await act(async () => {
      await result.current.addNote(sessionId, "w1", "Did task A");
    });

    const updatedSlot = result.current.activeSession!.slots.find((s) => s.id === "w1");
    expect(updatedSlot?.notes).toContain("Did task A");
  });
});
