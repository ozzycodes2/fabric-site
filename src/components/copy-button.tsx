"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  label: string;
  text?: string;
  showValue?: boolean;
};

export function CopyButton({ value, label, text = "Copy", showValue = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Fallback when the Clipboard API is unavailable or refused: select the
  // value so the reader can copy it by hand.
  function select() {
    const sel = window.getSelection();
    if (!sel || !ref.current) return;
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      select();
    }
  }

  return (
    <span className="inline-flex items-center gap-sm">
      <code ref={ref} className={showValue ? "font-mono text-mono text-ink-muted" : "sr-only"}>
        {value}
      </code>
      <button
        type="button"
        aria-label={label}
        onClick={copy}
        className="rounded-xs border border-hairline-strong px-xs text-eyebrow text-ink-muted hover:text-ink"
      >
        {copied ? "Copied" : text}
      </button>
    </span>
  );
}
