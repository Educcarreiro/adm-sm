export type HistoryEntryType = "login" | "logout" | "search" | "navigate" | "action";

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  description: string;
  user?: string;
  timestamp: string;
  meta?: Record<string, string>;
}

const STORAGE_KEY = "sm_activity_history";
const MAX_ENTRIES = 500;

export function addHistoryEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  const entries = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  if (entries.length > MAX_ENTRIES) entries.splice(MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage indisponível
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
