"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useQueryState } from "nuqs"
import { PromptInput } from "@/components/prompt-input"
import { CommandDisplay } from "@/components/command-display"
import { ExampleChips } from "@/components/example-chips"
import { CommandHistory, type HistoryEntry } from "@/components/command-history"
import { ModeToggle } from "@/components/mode-toggle"
import { TerminalIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { sanitizePrompt } from "@/lib/sanitize"
import { loadHistory, saveHistory } from "@/lib/localstorage"

const transport = new DefaultChatTransport({ api: "/api/generate" })
const HISTORY_STORAGE_KEY = "ffmgen-command-history"

export function HomeContent() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })
  const [input, setInput] = useState(query)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const lastPromptRef = useRef("")

  // Sync input when query changes from URL (back/forward navigation, external link with ?q=)
  useEffect(() => {
    setInput(query)
  }, [query])

  useEffect(() => {
    const loaded = loadHistory(HISTORY_STORAGE_KEY)
    if (loaded) {
      setHistory(loaded)
    }
  }, [])

  useEffect(() => {
    saveHistory(history, HISTORY_STORAGE_KEY)
  }, [history])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onFinish: ({ message }) => {
      const text =
        message.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") || ""

      if (text.trim()) {
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            prompt: lastPromptRef.current,
            command: text.trim(),
            timestamp: new Date(),
          },
          ...prev,
        ])
      }
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  const currentCommand = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
    if (!lastAssistant) return ""
    return (
      lastAssistant.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    )
  }, [messages])

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const { valid, sanitized, reason } = sanitizePrompt(input)
    if (!valid) {
      setError(reason ?? "Invalid input.")
      return
    }
    setError(null)
    lastPromptRef.current = sanitized
    await setQuery(sanitized)
    sendMessage({ text: sanitized })
  }, [input, isLoading, sendMessage, setQuery])

  const handleExampleSelect = useCallback(
    async (example: string) => {
      setError(null)
      setInput(example)
      await setQuery(example)
      lastPromptRef.current = example
      sendMessage({ text: example })
    },
    [sendMessage, setQuery]
  )

  const handleClear = useCallback(() => {
    setQuery("")
    setInput("")
    setMessages([])
  }, [setQuery, setMessages])

  const handleDownvote = useCallback((downvotedQuery: string, downvotedCommand: string) => {
    console.log("Downvote received:", { query: downvotedQuery, command: downvotedCommand })
    setHistory((prev) =>
      prev.map((entry) =>
        entry.prompt === downvotedQuery && entry.command === downvotedCommand
          ? { ...entry, downvoted: true }
          : entry
      )
    )
    // Trigger regeneration with the downvoted command as context
    lastPromptRef.current = downvotedQuery
    sendMessage({ text: `${downvotedQuery} [DOWNVOTED:${downvotedCommand}]` })
  }, [sendMessage])

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>

        <header className="flex flex-col items-center gap-4 mb-10">
          <Link
            href="/"
            onClick={handleClear}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
              <TerminalIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance group-hover:text-primary transition-colors">
                ffm<span className="text-primary">gen</span>
              </h1>
            </div>
          </Link>
          <p className="text-muted-foreground text-sm md:text-base max-w-md text-pretty text-center">
            Describe what you want to do with your video or audio.
            Get the exact ffmpeg command instantly.
          </p>
        </header>

        <section className="w-full mb-6" aria-label="Command input">
          <PromptInput
            value={input}
            onChange={(v) => {
              setInput(v)
              if (error) setError(null)
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasCommand={!!currentCommand}
            onClear={handleClear}
          />
          {error && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </section>

        {!currentCommand && !isLoading && (
          <section className="w-full mb-8 animate-in fade-in duration-300" aria-label="Examples">
            <p className="text-center text-xs text-muted-foreground mb-3">
              Try an example
            </p>
            <ExampleChips onSelect={handleExampleSelect} disabled={isLoading} />
          </section>
        )}

        <section className="w-full" aria-label="Generated command">
          <CommandDisplay
            command={currentCommand}
            isStreaming={status === "streaming"}
            query={query}
            onDownvote={handleDownvote}
          />
        </section>

        <CommandHistory
          history={history}
          onClear={() => setHistory([])}
          onDelete={(id) => setHistory(history.filter((h) => h.id !== id))}
        />

        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground/60">
            Commands are generated by AI. Always review before running.
          </p>
        </footer>
      </div>
    </main>
  )
}
