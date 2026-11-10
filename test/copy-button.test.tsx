// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CopyButton } from "@/components/copy-button";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function setup(writeText?: () => Promise<void>) {
  vi.stubGlobal("navigator", writeText ? { clipboard: { writeText } } : {});
  render(
    <CopyButton value="#ef6306" label="Copy primary" />,
  );
  return screen.getByRole("button", { name: "Copy primary" });
}

describe("CopyButton", () => {
  it("shows Copied after the clipboard write resolves", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    fireEvent.click(setup(writeText));
    expect(writeText).toHaveBeenCalledWith("#ef6306");
    await waitFor(() => expect(screen.getByRole("button").textContent).toBe("Copied"));
  });

  it("does not claim Copied when the write rejects, and selects the value", async () => {
    const select = vi.fn();
    vi.spyOn(window, "getSelection").mockReturnValue({
      removeAllRanges: vi.fn(),
      addRange: select,
    } as unknown as Selection);
    fireEvent.click(setup(() => Promise.reject(new Error("denied"))));
    await waitFor(() => expect(select).toHaveBeenCalled());
    expect(screen.getByRole("button").textContent).not.toBe("Copied");
  });

  it("selects the value when the clipboard API is absent", () => {
    const select = vi.fn();
    vi.spyOn(window, "getSelection").mockReturnValue({
      removeAllRanges: vi.fn(),
      addRange: select,
    } as unknown as Selection);
    fireEvent.click(setup());
    expect(select).toHaveBeenCalled();
    expect(screen.getByRole("button").textContent).not.toBe("Copied");
  });

  it("selects safely when there is no selection API", () => {
    vi.spyOn(window, "getSelection").mockReturnValue(null);
    fireEvent.click(setup());
    expect(screen.getByRole("button").textContent).toBe("Copy");
  });
});

describe("CopyButton display", () => {
  it("shows the value, or hides it visually when asked", () => {
    const { container, rerender } = render(<CopyButton value="#ef6306" label="x" />);
    expect(container.querySelector("code")?.className).not.toContain("sr-only");
    rerender(<CopyButton value="#ef6306" label="x" showValue={false} text="Copy CSS" />);
    expect(container.querySelector("code")?.className).toContain("sr-only");
    expect(screen.getByRole("button").textContent).toBe("Copy CSS");
  });
});
