// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CopyButton } from "@/components/copy-button";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.getSelection()?.removeAllRanges();
});

function setup(writeText?: () => Promise<void>, props: { showValue?: boolean; text?: string } = {}) {
  vi.stubGlobal("navigator", writeText ? { clipboard: { writeText } } : {});
  const utils = render(<CopyButton value="#ef6306" label="Copy primary" {...props} />);
  return { ...utils, button: screen.getByRole("button", { name: "Copy primary" }) };
}

describe("CopyButton", () => {
  it("shows Copied, announces it, then resets after 1500ms", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const { button } = setup(writeText);
    await act(async () => {
      fireEvent.click(button);
    });
    expect(writeText).toHaveBeenCalledWith("#ef6306");
    expect(button.textContent).toBe("Copied");
    expect(screen.getByRole("status").textContent).toBe("Copied");
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(button.textContent).toBe("Copy");
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("restarts the reset timer on re-click", async () => {
    vi.useFakeTimers();
    const { button } = setup(vi.fn().mockResolvedValue(undefined));
    await act(async () => {
      fireEvent.click(button);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      fireEvent.click(button);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(button.textContent).toBe("Copied");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(button.textContent).toBe("Copy");
  });

  it("clears the timer on unmount", async () => {
    vi.useFakeTimers();
    const { button, unmount } = setup(vi.fn().mockResolvedValue(undefined));
    await act(async () => {
      fireEvent.click(button);
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reveals and selects the value when the write rejects", async () => {
    const { button, container } = setup(() => Promise.reject(new Error("denied")), {
      showValue: false,
      text: "Copy CSS",
    });
    expect(container.querySelector("code")?.className).toContain("sr-only");
    fireEvent.click(button);
    await waitFor(() => expect(window.getSelection()?.toString()).toBe("#ef6306"));
    expect(container.querySelector("code")?.className).not.toContain("sr-only");
    expect(screen.queryByText("Copied")).toBeNull();
  });

  it("reveals and selects the value when the clipboard API is absent", () => {
    const { button, container } = setup(undefined, { showValue: false });
    fireEvent.click(button);
    expect(window.getSelection()?.toString()).toBe("#ef6306");
    expect(container.querySelector("code")?.className).not.toContain("sr-only");
    expect(screen.queryByText("Copied")).toBeNull();
  });

  it("does nothing further when there is no selection API", () => {
    vi.spyOn(window, "getSelection").mockReturnValue(null);
    const { button } = setup();
    fireEvent.click(button);
    expect(button.textContent).toBe("Copy");
    vi.restoreAllMocks();
  });

  it("shows the value, or hides it visually when asked", () => {
    const { container, rerender } = render(<CopyButton value="#ef6306" label="x" />);
    expect(container.querySelector("code")?.className).not.toContain("sr-only");
    rerender(<CopyButton value="#ef6306" label="x" showValue={false} text="Copy CSS" />);
    expect(container.querySelector("code")?.className).toContain("sr-only");
    expect(screen.getByRole("button").textContent).toBe("Copy CSS");
  });
});
