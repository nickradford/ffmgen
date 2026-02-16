"use client";

import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  ThumbsDownIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

export interface HistoryEntry {
  id: string;
  prompt: string;
  command: string;
  timestamp: Date;
  downvoted?: boolean;
}

const MAX_VISIBLE = 5;

export function CommandHistory({
  history,
  onClear,
  onDelete,
}: {
  history: HistoryEntry[];
  onClear: () => void;
  onDelete?: (id: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  if (history.length === 0) return null;

  const hasMore = history.length > MAX_VISIBLE;
  const visibleHistory = showAll ? history : history.slice(0, MAX_VISIBLE);

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm font-medium">History</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{history.length}</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <XIcon className="h-4 w-4" />
          Clear
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {visibleHistory.map((entry) => (
          <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} />
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-lg"
        >
          Show all ({history.length - MAX_VISIBLE} more)
        </button>
      )}
    </div>
  );
}

function HistoryItem({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3 group">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{entry.prompt}</p>
        <div className="flex items-center gap-1">
          {entry.downvoted && (
            <ThumbsDownIcon className="size-3.5 text-red-500" />
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
              aria-label="Delete entry"
            >
              <TrashIcon className="size-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
            aria-label="Copy command"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-primary" />
            ) : (
              <CopyIcon className="size-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      <pre className="font-mono text-xs text-foreground/80 whitespace-pre-wrap break-all">
        {entry.command}
      </pre>
    </div>
  );
}
