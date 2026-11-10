import Link from "next/link";
import { NavLinks } from "./nav-links";
import { VariantToggle } from "./variant-toggle";

// Below sm the nav takes its own row: four labels, the wordmark and the
// toggle do not fit one 390px line.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-hairline bg-canvas px-md sm:h-[56px] sm:flex-nowrap sm:gap-lg sm:px-lg">
      <Link href="/" className="inline-flex h-[56px] items-center gap-xxs text-subhead text-ink sm:h-auto">
        fabric
        <span aria-hidden className="inline-block size-[5px] bg-primary" />
      </Link>
      <div className="order-last -mx-xs basis-full pb-xs sm:order-none sm:mx-0 sm:mr-auto sm:basis-auto sm:pb-0">
        <NavLinks />
      </div>
      <VariantToggle />
    </header>
  );
}
