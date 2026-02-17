"use client";

import { ArrowRightIcon, SpinnerIcon, XIcon } from "@phosphor-icons/react";
import { useRef, useEffect, useState } from "react";

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  hasCommand,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasCommand?: boolean;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        setSubmittedValue(value);
        onSubmit();
      }
    }
  };

  const handleClick = () => {
    if (showClear) {
      onClear?.();
      inputRef.current?.focus();
    } else {
      setSubmittedValue(value);
      onSubmit();
    }
  };

  // Show X button when there's a command and input hasn't changed from submitted value
  const showClear = hasCommand && submittedValue !== null && value === submittedValue;

  return (
    <div className="relative w-full">
      <div className="relative rounded-xl border border-border bg-card shadow-lg shadow-background/50 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/75">
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Describe what you want to do, e.g. "convert to mp4 and compress"'
          className="w-full resize-none bg-transparent px-4 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none font-sans text-base leading-relaxed"
          disabled={isLoading}
          aria-label="Describe your ffmpeg task"
        />
        <button
          onClick={handleClick}
          disabled={(!value.trim() && !showClear) || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed outline-offset-4"
          aria-label={showClear ? "Clear prompt" : "Generate command"}
        >
          {isLoading ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" weight="bold" />
          ) : showClear ? (
            <XIcon className="h-4 w-4" weight="bold" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          )}
        </button>
      </div>
    </div>
  );
}
