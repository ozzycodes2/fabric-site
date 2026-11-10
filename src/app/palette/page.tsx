import type { Metadata } from "next";
import { PaletteView } from "@/components/palette-view";
import { palette } from "@/lib/palette";

export const metadata: Metadata = { title: "Palette · fabric" };

export default function PalettePage() {
  return (
    <main className="mx-auto max-w-[592px] px-lg pt-xxl">
      <h1 className="mb-md text-[32px] leading-none font-semibold tracking-[-0.8px] sm:text-display">Palette</h1>
      <p className="mb-xl text-body text-ink-muted">
        {palette.ui.length} roles and {palette.terminal.length} terminal colours, in dusk and dawn.
      </p>
      <PaletteView palette={palette} />
    </main>
  );
}
