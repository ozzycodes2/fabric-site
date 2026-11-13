"use client";

import { useEffect, useState } from "react";
import type { VariantSlug } from "@/lib/palette";

const VARIANTS: VariantSlug[] = ["dusk", "dawn"];

// A sun on the horizon; the arrow points down at dusk (sunset) and up at dawn
// (sunrise). Drawn in ink, not the accent: on dawn the accent reads 2.47:1,
// under the 3:1 an icon needs when it alone identifies the control.
function HorizonIcon({ variant }: { variant: VariantSlug }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      className="stroke-current"
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

// The theme-color metas follow the OS through their media queries; a manual
// choice has to overwrite both, or the chrome keeps the OS variant's ground.
function paintChrome(color: string) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
}

export function VariantToggle({ chrome }: { chrome: Record<VariantSlug, string> }) {
  const [active, setActive] = useState<VariantSlug | null>(null);

  useEffect(() => {
    const set = document.documentElement.dataset.variant;
    if (set === "dusk" || set === "dawn") paintChrome(chrome[set]);
    setActive(current());
  }, [chrome]);

  function choose(v: VariantSlug) {
    document.documentElement.dataset.variant = v;
    paintChrome(chrome[v]);
    try {
      localStorage.setItem("fabric-variant", v);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    setActive(v);
  }

  return (
    <div role="group" aria-label="Variant" className="inline-flex rounded-full border border-hairline p-[3px]">
      {VARIANTS.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={active === v}
          aria-label={v}
          title={v}
          onClick={() => choose(v)}
          className="inline-flex min-h-[32px] items-center rounded-full px-xs text-ink-subtle sm:px-sm hover:text-ink aria-pressed:bg-surface-3 aria-pressed:text-ink"
        >
          <HorizonIcon variant={v} />
        </button>
      ))}
    </div>
  );
}
