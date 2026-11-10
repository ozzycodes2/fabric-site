"use client";

import { useEffect, useState } from "react";
import type { VariantSlug } from "@/lib/palette";

const VARIANTS: VariantSlug[] = ["dusk", "dawn"];

// A sun on the horizon; the arrow points down at dusk (sunset) and up at dawn (sunrise).
function HorizonIcon({ variant }: { variant: VariantSlug }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      className="stroke-primary"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-icon={variant === "dusk" ? "sunset" : "sunrise"}
    >
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 2v7" />
      <path d={variant === "dusk" ? "m16 5-4 4-4-4" : "m8 6 4-4 4 4"} />
      <path d="m4.2 10.2 1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1" />
    </svg>
  );
}

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
    <div role="group" aria-label="Variant" className="inline-flex rounded-full border border-hairline p-[2px]">
      {VARIANTS.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={active === v}
          aria-label={v}
          title={v}
          onClick={() => choose(v)}
          className="inline-flex items-center rounded-full px-xs py-xxs aria-pressed:bg-surface-2"
        >
          <HorizonIcon variant={v} />
        </button>
      ))}
    </div>
  );
}
