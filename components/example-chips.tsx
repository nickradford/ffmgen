"use client"

import { useState } from "react"

const EXAMPLES = [
  "Convert MKV to MP4",
  "Compress video to reduce file size",
  "Extract audio from video",
  "Crop video to 1080x1080",
  "Create a GIF from video",
  "Add subtitles to video",
  "Trim video from 00:30 to 02:00",
  "Remove audio from video",
  "Merge two videos side by side",
  "Resize to 720p",
]

const VISIBLE_COUNT = 5

export function ExampleChips({
  onSelect,
  disabled,
}: {
  onSelect: (example: string) => void
  disabled: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleExamples = isExpanded ? EXAMPLES : EXAMPLES.slice(0, VISIBLE_COUNT)
  const hasMore = EXAMPLES.length > VISIBLE_COUNT

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {visibleExamples.map((example) => (
        <button
          key={example}
          onClick={() => onSelect(example)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {example}
        </button>
      ))}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExpanded ? "...less" : "...more"}
        </button>
      )}
    </div>
  )
}
