"use client"

import { Check, Clock, Copy, X } from "lucide-react"
import { useState } from "react"

export interface HistoryEntry {
  id: string
  prompt: string
  command: string
  timestamp: Date
}

export function CommandHistory({
  history,
  onClear,
}: {
  history: HistoryEntry[]
  onClear: () => void
}) {
  if (history.length === 0) return null

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">History</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {history.map((entry) => (
          <HistoryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3 group">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {entry.prompt}
        </p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="font-mono text-xs text-foreground/80 whitespace-pre-wrap break-all">
        {entry.command}
      </pre>
    </div>
  )
}
