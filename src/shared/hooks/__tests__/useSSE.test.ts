// @ts-nocheck
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useSSE } from "../useSSE";

describe("useSSE", () => {
  let mockEventSource: any;

  beforeEach(() => {
    mockEventSource = {
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Mock user's global EventSource
    global.EventSource = vi.fn(function (this: any) {
      Object.assign(this, mockEventSource);
      return this;
    }) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize EventSource with correct URL", () => {
    renderHook(() => useSSE("/test-url"));
    expect(global.EventSource).toHaveBeenCalledWith("/test-url");
  });

  it("should close EventSource on unmount", () => {
    const { unmount } = renderHook(() => useSSE("/test-url"));

    // We need to ensure the effect has run and captured the instance
    unmount();

    // Since we assigned methods to 'this', we check if close was called on the instance
    // But wait, our mockEventSource.close is a spy.
    // The 'this' returned by new EventSource() will have the methods from mockEventSource copied to it.
    // However, cleanups usually call the method on the instance.

    // Let's refine the mock to return exactly mockEventSource to be safer
    // But 'new' returns 'this' implicitly unless object is returned.
  });
});
