import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({ Inter: () => ({ variable: "font-inter" }) }));
import manifest from "@/app/manifest";
import { metadata, viewport } from "@/app/layout";

describe("site metadata", () => {
  it("tints the browser chrome to each variant's canvas by OS scheme", () => {
    expect(viewport.colorScheme).toBe("dark light");
    expect(viewport.themeColor).toEqual([
      { media: "(prefers-color-scheme: light)", color: "#eceef0" },
      { media: "(prefers-color-scheme: dark)", color: "#101214" },
    ]);
  });

  it("names the site fabric for previews and home-screen icons", () => {
    expect(metadata.applicationName).toBe("fabric");
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(String(metadata.metadataBase)).toMatch(/^https?:\/\//);
  });

  it("ships a manifest with the mark, including a maskable icon", () => {
    const m = manifest();
    expect(m.name).toBe("fabric");
    expect(m.theme_color).toBe("#101214");
    expect(m.icons!.map((i) => i.src)).toEqual(["/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"]);
    expect(m.icons![2].purpose).toBe("maskable");
  });
});
