"use client";

import { useState } from "react";
import { Segmented } from "./segmented";
import type { Port } from "@/lib/ports";

export function ThemesList({ ports }: { ports: Port[] }) {
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(ports.map((p) => p.category))).sort()];
  const shown = category === "all" ? ports : ports.filter((p) => p.category === category);

  return (
    <div>
      <Segmented label="Category" options={categories} value={category} onChange={setCategory} />
      <ul className="m-0 mt-xl grid list-none gap-md p-0 sm:grid-cols-2">
        {shown.map((p) => (
          <li key={p.slug}>
            <a
              href={p.url}
              className="group flex h-full flex-col gap-lg rounded-lg border border-hairline bg-surface-1 p-lg hover:border-hairline-strong hover:bg-surface-2"
            >
              <span className="flex items-baseline justify-between gap-md">
                <span className="text-subhead text-ink underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-primary">
                  {p.name}
                </span>
                <span className="rounded-full border border-hairline-strong px-sm py-xxs text-eyebrow text-ink-muted">
                  {p.category}
                </span>
              </span>
              <span className="mt-auto flex justify-between text-caption text-ink-subtle">
                <span className="capitalize">{p.type}</span>
                {p.contributors[0] && <span>by {p.contributors[0].name}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
