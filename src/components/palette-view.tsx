"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { cssForVariant, formatColor, type ColorFormat } from "@/lib/color-format";
import { groupRoles } from "@/lib/palette-groups";
import type { Palette, Role, VariantSlug } from "@/lib/palette";

const FORMATS: ColorFormat[] = ["hex", "rgb", "hsl"];

function Swatch({ role, variant, format, term }: { role: Role; variant: VariantSlug; format: ColorFormat; term?: boolean }) {
  const value = formatColor(role[variant], format);
  return (
    <li className="flex items-center gap-md border-b border-hairline py-sm last:border-b-0">
      <span
        aria-hidden
        className="size-[32px] shrink-0 rounded-xs border border-hairline"
        style={{ background: role[variant].hex }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-body text-ink">{term ? `term-${role.slug}` : role.slug}</span>
        <small className="block text-caption text-ink-subtle">{role.use}</small>
      </span>
      <CopyButton value={value} label={`Copy ${role.slug} ${variant} ${format}`} />
    </li>
  );
}

export function PaletteView({ palette }: { palette: Palette }) {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const groups = groupRoles(palette);

  return (
    <div>
      <div role="group" aria-label="Colour format" className="mb-lg flex gap-xs">
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={format === f}
            onClick={() => setFormat(f)}
            className="rounded-full border border-hairline-strong px-md py-xxs text-caption text-ink-muted aria-pressed:bg-surface-2 aria-pressed:text-ink"
          >
            {f}
          </button>
        ))}
      </div>
      {palette.variants.map((v) => (
        <section key={v.slug} aria-labelledby={`v-${v.slug}`} className="mb-section">
          <div className="mb-md flex items-baseline justify-between">
            <h2 id={`v-${v.slug}`} className="text-heading text-ink">
              {v.slug}
            </h2>
            <CopyButton
              value={cssForVariant(palette, v.slug)}
              label={`Copy CSS for ${v.slug}`}
              text="Copy CSS"
              showValue={false}
            />
          </div>
          {groups.map((g) => (
            <div key={g.name} className="mb-lg">
              <h3 className="mb-xs text-eyebrow uppercase text-ink-subtle">{g.name}</h3>
              <ul className="m-0 list-none border-y border-hairline p-0">
                {g.roles.map((r) => (
                  <Swatch key={r.slug} role={r} variant={v.slug} format={format} />
                ))}
              </ul>
            </div>
          ))}
          <div className="mb-lg">
            <h3 className="mb-xs text-eyebrow uppercase text-ink-subtle">Terminal</h3>
            <ul className="m-0 list-none border-y border-hairline p-0">
              {palette.terminal.map((r) => (
                <Swatch key={r.slug} role={r} variant={v.slug} format={format} term />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
