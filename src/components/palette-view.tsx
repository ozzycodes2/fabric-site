"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { InfoTip } from "./info-tip";
import { Segmented } from "./segmented";
import { cssForVariant, formatColor, type ColorFormat } from "@/lib/color-format";
import { groupRoles } from "@/lib/palette-groups";
import type { Palette, Role, VariantSlug } from "@/lib/palette";

const FORMATS = ["hex", "rgb", "hsl"] as const satisfies readonly ColorFormat[];

type TileProps = { role: Role; variant: VariantSlug; format: ColorFormat; featured?: boolean };

function Tile({ role, variant, format, featured }: TileProps) {
  return (
    <li className="flex min-w-0 flex-col gap-xs">
      <span
        aria-hidden
        className={featured ? "h-[160px] rounded-md border border-hairline" : "h-[88px] rounded-md border border-hairline"}
        style={{ background: role[variant].hex }}
      />
      <Details role={role} name={role.slug} variant={variant} format={format} />
    </li>
  );
}

// Name with its usage note behind an info icon, then the value and copy icon,
// each on one fixed-height line so tiles in a row stay aligned.
function Details({ role, name, variant, format }: Omit<TileProps, "featured"> & { name: string }) {
  return (
    <>
      <span className="relative flex items-center gap-xxs">
        <span className="truncate text-body font-medium text-ink">{name}</span>
        <InfoTip label={`About ${name}`} text={role.use} />
      </span>
      <CopyButton value={formatColor(role[variant], format)} label={`Copy ${name} ${variant} ${format}`} />
    </>
  );
}

// Columns follow the group size so a five-step ramp reads as one row.
const COLS: Record<number, string> = { 3: "sm:grid-cols-3", 5: "sm:grid-cols-3 lg:grid-cols-5" };

function TermChip({ role, variant, format }: Omit<TileProps, "featured">) {
  return (
    <li className="flex min-w-0 flex-col gap-xs">
      <span
        aria-hidden
        className="h-[64px] rounded-sm border border-hairline"
        style={{ background: role[variant].hex }}
      />
      <Details role={role} name={role.slug} variant={variant} format={format} />
    </li>
  );
}

// A short shell session painted in the variant's own colors, so the terminal
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
      <Segmented label="Color format" options={FORMATS} value={format} onChange={setFormat} />
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
              text="CSS"
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
              <ul key={i} className="m-0 mt-lg grid list-none grid-cols-2 gap-x-md gap-y-lg p-0 sm:grid-cols-4">
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
