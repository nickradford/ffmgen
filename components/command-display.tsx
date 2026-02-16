"use client";

import { CheckIcon, CopyIcon, TerminalIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import { useState } from "react";

export function CommandDisplay({
  command,
  isStreaming,
  query,
  onDownvote,
}: {
  command: string;
  isStreaming: boolean;
  query: string;
  onDownvote?: (query: string, command: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!command && !isStreaming) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TerminalIcon className="size-4" />
          <span className="text-sm font-medium">Generated Command</span>
        </div>
        {command && !isStreaming && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownvote?.(query, command)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Downvote this command"
            >
              <ThumbsDownIcon className="size-4" />
              <span>Not good</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Copy command to clipboard"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-4 text-primary" />
                  <span className="text-primary">Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="relative rounded-lg border border-border bg-card p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-all">
          <code>{command}</code>
          {isStreaming && <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />}
        </pre>
      </div>
    </div>
  );
}
