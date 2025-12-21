import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest"; // Removed afterEach as we're not using it

import { useNotificationStore } from "../notificationStore";

describe("reproStacking", () => {
  beforeEach(() => {
    useNotificationStore.getState().clearNotifications();
    vi.useFakeTimers();
  });

  it("should stack multiple notifications", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.addNotification({ title: "1", message: "1" });
    });
    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.addNotification({ title: "2", message: "2" });
    });
    expect(result.current.notifications).toHaveLength(2);

    // Verify order (newest first)
    expect(result.current.notifications[0].title).toBe("2");
    expect(result.current.notifications[1].title).toBe("1");
  });
});
