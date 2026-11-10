import type { Metadata } from "next";
import { PaletteView } from "@/components/palette-view";
import { palette } from "@/lib/palette";

export const metadata: Metadata = { title: "Palette · fabric" };

export default function PalettePage() {
  return (
    <main className="mx-auto max-w-[960px] px-lg pt-xxl">
      <h1 className="mb-xl text-[32px] leading-none font-semibold tracking-[-0.8px] sm:text-display">Palette</h1>
      <PaletteView palette={palette} />
    </main>
  );
}
