import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Session } from "@/lib/domain/session";
import { Task } from "@/lib/domain/task";

const DB_NAME = "deep-work-db";
const DB_VERSION = 1;

interface DeepWorkSchema extends DBSchema {
  sessions: {
    key: string;
    value: Session;
  };
  tasks: {
    key: string;
    value: Task;
  };
}

let dbPromise: Promise<IDBPDatabase<DeepWorkSchema>> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<DeepWorkSchema>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("sessions")) {
          database.createObjectStore("sessions", { keyPath: "id" });
        }
        if (!database.objectStoreNames.contains("tasks")) {
          database.createObjectStore("tasks", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("sessions", "readwrite");
  await Promise.all(sessions.map((session) => tx.store.put(session)));
  await tx.done;
}

export async function loadSessions(): Promise<Session[]> {
  const db = await getDb();
  return db.getAll("sessions");
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("tasks", "readwrite");
  await Promise.all(tasks.map((task) => tx.store.put(task)));
  await tx.done;
}

export async function loadTasks(): Promise<Task[]> {
  const db = await getDb();
  return db.getAll("tasks");
}

export interface ExportPayload {
  sessions: Session[];
  tasks: Task[];
}

export async function exportData(): Promise<ExportPayload> {
  const [sessions, tasks] = await Promise.all([loadSessions(), loadTasks()]);
  return { sessions, tasks };
}

export async function importData(payload: ExportPayload): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["sessions", "tasks"], "readwrite");
  await Promise.all(payload.sessions.map((session) => tx.objectStore("sessions").put(session)));
  await Promise.all(payload.tasks.map((task) => tx.objectStore("tasks").put(task)));
  await tx.done;
}
