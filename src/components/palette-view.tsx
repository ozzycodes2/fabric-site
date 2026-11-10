"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { Segmented } from "./segmented";
import { cssForVariant, formatColor, type ColorFormat } from "@/lib/color-format";
import { groupRoles } from "@/lib/palette-groups";
import type { Palette, Role, VariantSlug } from "@/lib/palette";

const FORMATS = ["hex", "rgb", "hsl"] as const satisfies readonly ColorFormat[];

type TileProps = { role: Role; variant: VariantSlug; format: ColorFormat; featured?: boolean };

function Tile({ role, variant, format, featured }: TileProps) {
  return (
    <li className="flex flex-col gap-sm">
      <span
        aria-hidden
        className={featured ? "h-[160px] rounded-md border border-hairline" : "h-[88px] rounded-md border border-hairline"}
        style={{ background: role[variant].hex }}
      />
      <span>
        <span className="block text-body font-medium text-ink">{role.slug}</span>
        <small className="block text-caption text-ink-subtle">{role.use}</small>
      </span>
      <CopyButton value={formatColor(role[variant], format)} label={`Copy ${role.slug} ${variant} ${format}`} />
    </li>
  );
}

// Columns follow the group size so a five-step ramp reads as one row.
const COLS: Record<number, string> = { 3: "sm:grid-cols-3", 5: "sm:grid-cols-3 lg:grid-cols-5" };

function TermChip({ role, variant, format }: Omit<TileProps, "featured">) {
  return (
    <li className="flex min-w-0 flex-col gap-xs">
      <span
        aria-hidden
        className="aspect-square rounded-sm border border-hairline"
        style={{ background: role[variant].hex }}
      />
      <span className="text-caption break-words text-ink">{role.slug}</span>
      <CopyButton value={formatColor(role[variant], format)} label={`Copy term-${role.slug} ${variant} ${format}`} />
    </li>
  );
}

// A short shell session painted in the variant's own colours, so the terminal
// palette is seen in use rather than only as chips.
function TerminalSample({ palette, variant }: { palette: Palette; variant: VariantSlug }) {
  const hex = (roles: Role[], slug: string) => roles.find((r) => r.slug === slug)?.[variant].hex;
  const t = (slug: string) => ({ color: hex(palette.terminal, slug) });
  return (
    <pre
      aria-label={`Terminal sample in ${variant}`}
      className="m-0 overflow-x-auto rounded-md border border-hairline p-lg font-mono text-mono"
      style={{ background: hex(palette.ui, "canvas"), color: hex(palette.ui, "ink") }}
    >
      <span style={t("green")}>~/fabric</span> <span style={t("blue")}>main</span>{" "}
      <span style={t("magenta")}>❯</span> ls{"\n"}
      <span style={t("blue")}>dist</span>  <span style={t("blue")}>src</span>  README.md  <span style={t("green")}>install.sh</span>
      {"\n"}
      <span style={t("magenta")}>❯</span> git status --short{"\n"}
      <span style={t("red")}> M</span> palette.json{"\n"}
      <span style={t("green")}>A </span> ghostty.conf{"\n"}
      <span style={t("yellow")}>??</span> <span style={t("bright-black")}>notes.txt</span>
    </pre>
  );
}

export function PaletteView({ palette }: { palette: Palette }) {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const groups = groupRoles(palette);
  const normal = palette.terminal.filter((r) => !r.slug.startsWith("bright-"));
  const bright = palette.terminal.filter((r) => r.slug.startsWith("bright-"));

  return (
    <div>
      <Segmented label="Colour format" options={FORMATS} value={format} onChange={setFormat} />
      {palette.variants.map((v) => (
        <section key={v.slug} data-show={v.slug} aria-labelledby={`v-${v.slug}`} className="mt-xxl">
          <div className="flex flex-wrap items-end justify-between gap-md border-b border-hairline pb-md">
            <div>
              <h2 id={`v-${v.slug}`} className="text-heading text-ink">
                {v.name}
              </h2>
              <p className="text-caption text-ink-subtle">
                {v.id}. Switch variant with the toggle in the header.
              </p>
            </div>
            <CopyButton
              value={cssForVariant(palette, v.slug)}
              label={`Copy CSS for ${v.slug}`}
              text="Copy CSS"
              showValue={false}
            />
          </div>
          {groups.map((g) => (
            <div key={g.name} className="mt-xxl">
              <h3 className="mb-md text-subhead font-semibold text-ink">{g.name}</h3>
              <ul
                className={`m-0 grid list-none grid-cols-2 gap-x-md gap-y-lg p-0 ${COLS[g.roles.length] ?? "sm:grid-cols-4"}`}
              >
                {g.roles.map((r) => (
                  <Tile key={r.slug} role={r} variant={v.slug} format={format} featured={g.name === "Accent"} />
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-xxl">
            <h3 className="mb-md text-subhead font-semibold text-ink">Terminal</h3>
            <TerminalSample palette={palette} variant={v.slug} />
            {[normal, bright].map((row, i) => (
              <ul key={i} className="m-0 mt-lg grid list-none grid-cols-4 gap-x-md gap-y-lg p-0 sm:grid-cols-8">
                {row.map((r) => (
                  <TermChip key={r.slug} role={r} variant={v.slug} format={format} />
                ))}
              </ul>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
