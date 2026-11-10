"use client";

import { useId, useState } from "react";
import { InfoIcon } from "./icons";

// Shows on hover or keyboard focus; Escape hides it without moving focus.
export function InfoTip({ label, text }: { label: string; text: string }) {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  return (
    <span className="group/tip static inline-flex" onMouseLeave={() => setDismissed(false)} onBlur={() => setDismissed(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        onKeyDown={(e) => e.key === "Escape" && setDismissed(true)}
        className="inline-flex size-[24px] items-center justify-center rounded-full text-ink-subtle hover:text-ink"
      >
        <InfoIcon />
      </button>
      <span
        id={id}
        role="tooltip"
        data-dismissed={dismissed || undefined}
        className="pointer-events-none invisible absolute inset-x-0 top-full z-10 mt-xxs rounded-sm border border-hairline-strong bg-surface-3 p-sm text-caption text-ink group-hover/tip:visible group-focus-within/tip:visible data-dismissed:invisible"
      >
        {text}
      </span>
    </span>
  );
}
