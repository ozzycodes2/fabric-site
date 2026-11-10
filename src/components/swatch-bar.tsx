"use client";

import type { MouseEvent } from "react";
import { useCopy } from "@/lib/use-copy";
import { CheckIcon } from "./icons";

export type Swatch = { slug: string; name: string; hex: string; ink: string };

// The hovered or focused segment widens in place to show its name and hex;
// clicking copies the hex. Labels fade in after the widening starts so they
// are never seen clipped mid-motion.
export function SwatchBar({ swatches, border }: { swatches: Swatch[]; border: string }) {
  const { copied, copy } = useCopy();
  const current = swatches.find((s) => s.slug === copied);

  async function onClick(e: MouseEvent<HTMLButtonElement>, s: Swatch) {
    const hex = e.currentTarget.querySelector("[data-hex]");
    if (await copy(s.hex, s.slug)) return;
    const sel = window.getSelection();
    if (!sel || !hex) return;
    const range = document.createRange();
    range.selectNodeContents(hex);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  return (
    <div className="flex h-[56px] overflow-hidden rounded-sm border" style={{ borderColor: border }}>
      {swatches.map((s) => (
        <button
          key={s.slug}
          type="button"
          data-swatch
          aria-label={`Copy ${s.name} ${s.hex}`}
          data-copied={copied === s.slug || undefined}
          onClick={(e) => onClick(e, s)}
          className="group relative min-w-0 grow basis-0 overflow-hidden text-left hover:grow-[4] focus-visible:grow-[4] data-copied:grow-[4]"
          style={{ background: s.hex, color: s.ink, outlineColor: s.ink, outlineOffset: -4 }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 flex flex-col justify-center gap-[2px] px-sm whitespace-nowrap opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-hover:delay-100 group-hover:duration-150 group-focus-visible:opacity-100 group-focus-visible:delay-100 group-focus-visible:duration-150 group-data-copied:opacity-100"
          >
            <span className="text-caption">{s.name}</span>
            <span data-hex className="inline-flex items-center gap-xxs font-mono text-mono select-text">
              {copied === s.slug ? (
                <>
                  <CheckIcon />
                  Copied
                </>
              ) : (
                s.hex
              )}
            </span>
          </span>
        </button>
      ))}
      <span role="status" aria-live="polite" className="sr-only">
        {current ? `Copied ${current.hex}` : ""}
      </span>
    </div>
  );
}
