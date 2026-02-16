const cache = new Map<string, { command: string; createdAt: number }>()

const MAX_CACHE_SIZE = 500
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().trim().replace(/\s+/g, " ")
}

export function getCachedCommand(prompt: string): string | null {
  const key = normalizePrompt(prompt)
  const entry = cache.get(key)
  if (!entry) return null

  if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }

  return entry.command
}

export function setCachedCommand(prompt: string, command: string): void {
  // Evict oldest entries if at capacity
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value
    if (oldestKey) cache.delete(oldestKey)
  }

  const key = normalizePrompt(prompt)
  cache.set(key, { command, createdAt: Date.now() })
}
