import type { Metadata } from "next";
import { ThemesList } from "@/components/themes-list";
import { getPorts } from "@/lib/ports";

export const metadata: Metadata = { title: "Integrations · fabric" };

export default function IntegrationsPage() {
  const ports = getPorts();
  return (
    <main className="mx-auto max-w-[960px] px-lg pt-xxl">
      <h1 className="mb-md text-[32px] leading-none font-semibold tracking-[-0.8px] sm:text-display">Integrations</h1>
      <p className="mb-xl max-w-[592px] text-body text-ink-muted">
        {ports.length} {ports.length === 1 ? "integration" : "integrations"} of fabric.
      </p>
      <ThemesList ports={ports} />
    </main>
  );
}
