"use client";

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/use-copy";
import { CheckIcon, CopyIcon } from "./icons";

type Props = {
  value: string;
  label: string;
  text?: string;
  showValue?: boolean;
};

// Icon-only unless `text` is given, which then sits beside the icon.
export function CopyButton({ value, label, text, showValue = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { copied: key, copy: write } = useCopy();
  const copied = key !== null;
  const [failed, setFailed] = useState(false);

  // Fallback when the Clipboard API is unavailable or refused: reveal the
  // value and select it so the reader can copy it by hand.
  useEffect(() => {
    const sel = window.getSelection();
    if (!failed || !sel || !ref.current) return;
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    sel.removeAllRanges();
    sel.addRange(range);
  }, [failed]);

  async function copy() {
    setFailed(!(await write(value)));
  }

  const visible = showValue || failed;
  return (
    <span className="inline-flex flex-wrap items-center gap-xxs">
      <code
        ref={ref}
        className={
          !visible ? "sr-only" : showValue ? "font-mono text-mono whitespace-nowrap text-ink-muted" : "block w-full whitespace-pre font-mono text-mono text-ink-muted"
        }
      >
        {value}
      </code>
      <button
        type="button"
        aria-label={label}
        title={copied ? "Copied" : label}
        data-copied={copied || undefined}
        onClick={copy}
        className={
          text
            ? "inline-flex min-h-[28px] items-center gap-xxs rounded-xs border border-hairline-strong px-sm text-eyebrow text-ink-muted hover:border-ink-subtle hover:text-ink"
            : "inline-flex size-[28px] items-center justify-center rounded-xs text-ink-subtle hover:bg-surface-2 hover:text-ink"
        }
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {text}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
