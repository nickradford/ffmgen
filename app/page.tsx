"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { PromptInput } from "@/components/prompt-input"
import { CommandDisplay } from "@/components/command-display"
import { ExampleChips } from "@/components/example-chips"
import { CommandHistory, type HistoryEntry } from "@/components/command-history"
import { Terminal } from "lucide-react"
import { sanitizePrompt } from "@/lib/sanitize"

const transport = new DefaultChatTransport({ api: "/api/generate" })
const HISTORY_STORAGE_KEY = "ffmgen-command-history"

export default function Home() {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const lastPromptRef = useRef("")

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const withDates = parsed.map((entry: HistoryEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
        setHistory(withDates)
      } catch {
        console.error("Failed to parse history from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const { messages, sendMessage, status } = useChat({
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

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    const { valid, sanitized, reason } = sanitizePrompt(input)
    if (!valid) {
      setError(reason ?? "Invalid input.")
      return
    }
    setError(null)
    lastPromptRef.current = sanitized
    sendMessage({ text: sanitized })
  }, [input, isLoading, sendMessage])

  const handleExampleSelect = useCallback(
    (example: string) => {
      setError(null)
      setInput(example)
      lastPromptRef.current = example
      sendMessage({ text: example })
    },
    [sendMessage]
  )

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <header className="flex flex-col items-center gap-4 mb-10">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 border border-primary/20">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
              ffm<span className="text-primary">gen</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-md text-pretty">
              Describe what you want to do with your video or audio.
              Get the exact ffmpeg command instantly.
            </p>
          </div>
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
          />
        </section>

        <CommandHistory
          history={history}
          onClear={() => setHistory([])}
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
