const MAX_PROMPT_LENGTH = 500

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /you\s+are\s+now/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /\bact\s+as\b/i,
  /\brole\s*play\b/i,
  /pretend\s+(you|to\s+be)/i,
  /override\s+(your|the|all)/i,
  /forget\s+(your|all|everything)/i,
  /reveal\s+(your|the)\s+(system|instructions|prompt)/i,
  /what\s+(are|is)\s+your\s+(instructions|system\s*prompt|rules)/i,
]

export interface SanitizeResult {
  valid: boolean
  sanitized: string
  reason?: string
}

export function sanitizePrompt(raw: string): SanitizeResult {
  const trimmed = raw.trim()

  if (!trimmed) {
    return { valid: false, sanitized: "", reason: "Prompt cannot be empty." }
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      sanitized: "",
      reason: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`,
    }
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        sanitized: "",
        reason: "Please describe an ffmpeg task like video or audio processing.",
      }
    }
  }

  // Strip control characters and excessive whitespace
  const cleaned = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")

  return { valid: true, sanitized: cleaned }
}
