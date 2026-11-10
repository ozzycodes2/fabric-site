"use client";

import { useEffect, useState } from "react";
import type { VariantSlug } from "@/lib/palette";

const VARIANTS: VariantSlug[] = ["dusk", "dawn"];

function current(): VariantSlug {
  const set = document.documentElement.dataset.variant;
  if (set === "dusk" || set === "dawn") return set;
  const light = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return light ? "dawn" : "dusk";
}

export function VariantToggle() {
  const [active, setActive] = useState<VariantSlug | null>(null);

  useEffect(() => setActive(current()), []);

  function choose(v: VariantSlug) {
    document.documentElement.dataset.variant = v;
    try {
      localStorage.setItem("fabric-variant", v);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    setActive(v);
  }

  return (
    <div role="group" aria-label="Variant" className="inline-flex gap-xs">
      {VARIANTS.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={active === v}
          onClick={() => choose(v)}
          className="rounded-full border border-hairline-strong px-md py-xs text-caption text-ink-muted aria-pressed:bg-surface-3 aria-pressed:text-ink"
        >
          {v}
        </button>
      ))}
    </div>
  );
}
