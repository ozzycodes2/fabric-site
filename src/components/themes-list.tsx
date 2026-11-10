"use client";

import { useState } from "react";
import type { Port } from "@/lib/ports";

export function ThemesList({ ports }: { ports: Port[] }) {
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(ports.map((p) => p.category))).sort()];
  const shown = category === "all" ? ports : ports.filter((p) => p.category === category);

  return (
    <div>
      <div role="group" aria-label="Category" className="mb-lg flex flex-wrap gap-xs">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className="rounded-full border border-hairline-strong px-md py-xxs text-caption text-ink-muted aria-pressed:bg-surface-2 aria-pressed:text-ink"
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="m-0 list-none border-y border-hairline p-0">
        {shown.map((p) => (
          <li key={p.slug} className="flex items-baseline justify-between border-b border-hairline py-sm last:border-b-0">
            <a href={p.url} className="text-ink underline decoration-1 underline-offset-2">
              {p.name}
            </a>
            <small className="text-caption text-ink-subtle">{p.category}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
