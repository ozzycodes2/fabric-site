// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SwatchBar } from "@/components/swatch-bar";
import { SwatchStrip } from "@/components/swatch-strip";
import { palette } from "@/lib/palette";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  window.getSelection()?.removeAllRanges();
});

const swatches = [
  { slug: "canvas", name: "Canvas", hex: "#f4f4f4", ink: "#2c2c2c" },
  { slug: "primary", name: "Primary", hex: "#ef6306", ink: "#2c2c2c" },
];

function setup(writeText?: () => Promise<void>) {
  vi.stubGlobal("navigator", writeText ? { clipboard: { writeText } } : {});
  render(<SwatchBar swatches={swatches} border="#ccc" />);
  return screen.getByRole("button", { name: "Copy Primary #ef6306" });
}

describe("SwatchBar", () => {
  it("names each segment and paints its label in the chosen ink", () => {
    const b = setup();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(b.textContent).toBe("Primary#ef6306");
    expect(b.style.color).toBe("rgb(44, 44, 44)");
  });

  it("copies the hex, shows Copied, announces it, then resets", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const b = setup(writeText);
    await act(async () => {
      fireEvent.click(b);
    });
    expect(writeText).toHaveBeenCalledWith("#ef6306");
    expect(b.dataset.copied).toBe("true");
    expect(b.querySelector("[data-hex]")!.textContent).toBe("Copied");
    expect(b.querySelector("svg")!.dataset.icon).toBe("check");
    expect(screen.getByRole("status").textContent).toBe("Copied #ef6306");
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(b.dataset.copied).toBeUndefined();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("selects the hex for a manual copy when the clipboard refuses", async () => {
    const b = setup(() => Promise.reject(new Error("denied")));
    fireEvent.click(b);
    await waitFor(() => expect(window.getSelection()?.toString()).toBe("#ef6306"));
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("does nothing further without a selection API", async () => {
    vi.spyOn(window, "getSelection").mockReturnValue(null);
    const b = setup();
    await act(async () => {
      fireEvent.click(b);
    });
    expect(b.dataset.copied).toBeUndefined();
  });
});

describe("SwatchStrip labels", () => {
  it("uses ink on dark segments and canvas on light ones", () => {
    const ink = (v: "dusk" | "dawn", slug: string) => palette.ui.find((r) => r.slug === slug)![v].hex;
    render(<SwatchStrip palette={palette} variant="dusk" />);
    const label = (name: RegExp) => screen.getByRole("button", { name }).style.outlineColor;
    const hexToRgb = (h: string) => `rgb(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`;
    expect(label(/^Copy Canvas/)).toBe(hexToRgb(ink("dusk", "ink")));
    expect(label(/^Copy Ink #/)).toBe(hexToRgb(ink("dusk", "canvas")));
  });
});

describe("SwatchStrip primary button", () => {
  it("carries the variant's primary fills for rest, hover and press", () => {
    const fill = (slug: string) => palette.ui.find((r) => r.slug === slug)!.dawn.hex;
    render(<SwatchStrip palette={palette} variant="dawn" />);
    const b = screen.getByRole("button", { name: "Primary" });
    expect(b.style.getPropertyValue("--fill")).toBe(fill("primary"));
    expect(b.style.getPropertyValue("--fill-hover")).toBe(fill("primary-hover"));
    expect(b.style.getPropertyValue("--fill-press")).toBe(fill("primary-focus"));
    expect(b.className).toMatch(/hover:bg-\(--fill-hover\).*active:bg-\(--fill-press\)/);
  });
});
