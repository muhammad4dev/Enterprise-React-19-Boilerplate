import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { useNotificationStore } from "../notificationStore";

describe("useNotificationStore", () => {
  beforeEach(() => {
    act(() => {
      useNotificationStore.getState().clearNotifications();
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should add a notification", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.addNotification({
        title: "Test Notification",
        message: "This is a test",
        type: "info",
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      title: "Test Notification",
      message: "This is a test",
      type: "info",
    });
  });

  it("should remove a notification", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.addNotification({
        title: "Test",
        message: "Message",
      });
    });

    const id = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(id);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it("should automatically remove notification after duration", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.addNotification({
        title: "Auto Remove",
        message: "Bye",
        duration: 1000,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
