import type { Metadata } from "next";
import { IntegrationsList } from "@/components/integrations-list";
import { getIntegrations } from "@/lib/integrations";

export const metadata: Metadata = { title: "Integrations · fabric" };

export default function IntegrationsPage() {
  const integrations = getIntegrations();
  return (
    <main className="mx-auto max-w-[960px] px-lg pt-xxl">
      <h1 className="mb-md text-display">Integrations</h1>
      <p className="mb-xl max-w-[592px] text-body text-ink-muted">
        {integrations.length} {integrations.length === 1 ? "integration" : "integrations"} of fabric.
      </p>
      <IntegrationsList integrations={integrations} />
    </main>
  );
}
