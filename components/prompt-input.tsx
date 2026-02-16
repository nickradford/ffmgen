"use client"

import { ArrowRight, Loader2 } from "lucide-react"

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative rounded-xl border border-border bg-card shadow-lg shadow-background/50 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Describe what you want to do, e.g. "convert to mp4 and compress"'
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none font-sans text-base leading-relaxed"
          disabled={isLoading}
          aria-label="Describe your ffmpeg task"
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Generate command"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
