import Link from "next/link";
import { canvasOf, palette } from "@/lib/palette";
import { NavLinks } from "./nav-links";
import { VariantToggle } from "./variant-toggle";

// A dotless ı carries the accent square as its tittle. The glyphs are hidden
// from assistive tech so the link reads "fabric", not "fabr ı c".
function Wordmark() {
  return (
    <>
      <span className="sr-only">fabric</span>
      <span aria-hidden>
        fabr
        <span className="relative">
          ı
          <span className="absolute top-[0.235em] left-[calc(50%+0.015em)] size-[0.15em] -translate-x-1/2 bg-primary" />
        </span>
        c
      </span>
    </>
  );
}

// Below sm the nav takes its own row: four labels, the wordmark and the
// toggle do not fit one 390px line.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-hairline bg-canvas px-md sm:h-[56px] sm:flex-nowrap sm:gap-lg sm:px-lg">
      <Link
        href="/"
        className="inline-flex h-[56px] items-center text-[22px] leading-none font-bold tracking-[-0.03em] text-ink [font-variation-settings:'opsz'_32] sm:h-auto"
      >
        <Wordmark />
      </Link>
      <div className="order-last -mx-xs basis-full pb-xs sm:order-none sm:mx-0 sm:mr-auto sm:basis-auto sm:pb-0">
        <NavLinks />
      </div>
      <VariantToggle chrome={{ dusk: canvasOf(palette, "dusk"), dawn: canvasOf(palette, "dawn") }} />
    </header>
  );
}
