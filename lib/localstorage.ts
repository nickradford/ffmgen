import type { HistoryEntry } from "@/components/command-history"

const HISTORY_SCHEMA_VERSION = 1

interface SerializedEntry {
  id: string
  prompt: string
  command: string
  timestamp: string
}

interface StoredHistory {
  version: number
  entries: SerializedEntry[]
}

function serializeEntry(entry: HistoryEntry): SerializedEntry {
  return {
    id: entry.id,
    prompt: entry.prompt,
    command: entry.command,
    timestamp: entry.timestamp.toISOString(),
  }
}

function deserializeEntry(entry: SerializedEntry): HistoryEntry {
  return {
    id: entry.id,
    prompt: entry.prompt,
    command: entry.command,
    timestamp: new Date(entry.timestamp),
  }
}

function validateEntry(entry: unknown): entry is SerializedEntry {
  if (typeof entry !== "object" || entry === null) return false
  const e = entry as Record<string, unknown>
  return (
    typeof e.id === "string" &&
    typeof e.prompt === "string" &&
    typeof e.command === "string" &&
    typeof e.timestamp === "string"
  )
}

export function saveHistory(entries: HistoryEntry[], key: string): void {
  try {
    const data: StoredHistory = {
      version: HISTORY_SCHEMA_VERSION,
      entries: entries.map(serializeEntry),
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    console.error("Failed to save history to localStorage")
  }
}

export function loadHistory(key: string): HistoryEntry[] | null {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null

    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== "object" || parsed === null) return null

    const data = parsed as StoredHistory
    if (data.version !== HISTORY_SCHEMA_VERSION) return null
    if (!Array.isArray(data.entries)) return null

    const validEntries = data.entries.filter(validateEntry)
    return validEntries.map(deserializeEntry)
  } catch {
    console.error("Failed to load history from localStorage")
    return null
  }
}
