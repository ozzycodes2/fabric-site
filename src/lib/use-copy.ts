"use client";

import { useEffect, useRef, useState } from "react";

// `copied` holds the key of the last successful copy for `reset` ms. `copy`
// resolves false when the Clipboard API is missing or refused, so the caller
// can fall back to selecting the value for a manual copy.
export function useCopy(reset = 1500) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(value: string, key = value): Promise<boolean> {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      timer.current = setTimeout(() => setCopied(null), reset);
      return true;
    } catch {
      setCopied(null);
      return false;
    }
  }

  return { copied, copy };
}
