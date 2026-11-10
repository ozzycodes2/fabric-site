import { VariantToggle } from "@/components/variant-toggle";

export default function Home() {
  return (
    <main className="flex flex-col items-start gap-lg p-section">
      <h1 className="text-display">fabric</h1>
      <VariantToggle />
    </main>
  );
}
