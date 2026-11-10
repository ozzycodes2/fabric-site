import Link from "next/link";
import { NavLinks } from "./nav-links";
import { VariantToggle } from "./variant-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-[56px] items-center justify-between border-b border-hairline px-md sm:px-lg">
      <div className="flex items-center gap-sm sm:gap-lg">
        <Link href="/" className="inline-flex items-center gap-xxs text-[15px] font-semibold tracking-[-0.2px] text-ink">
          fabric
          <span aria-hidden className="inline-block size-[5px] bg-primary" />
        </Link>
        <NavLinks />
      </div>
      <VariantToggle />
    </header>
  );
}
