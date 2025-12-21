import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useNotificationStore } from "@/stores/notificationStore";

import { NotificationToast } from "../NotificationToast";

// Mock the store
vi.mock("@/stores/notificationStore");

describe("NotificationToast", () => {
  it("should render notifications", () => {
    // Mock the hook implementation
    (useNotificationStore as any).mockReturnValue({
      notifications: [
        { id: "1", title: "Test 1", message: "Msg 1", type: "info" },
        { id: "2", title: "Test 2", message: "Msg 2", type: "warning" },
      ],
      removeNotification: vi.fn(),
    });

    render(<NotificationToast />);

    expect(screen.getByText("Test 1")).toBeInTheDocument();
    expect(screen.getByText("Msg 1")).toBeInTheDocument();
    expect(screen.getByText("Test 2")).toBeInTheDocument();
  });

  it("should call removeNotification when close button is clicked", () => {
    const mockRemove = vi.fn();
    (useNotificationStore as any).mockReturnValue({
      notifications: [
        { id: "1", title: "Test 1", message: "Msg 1", type: "info" },
      ],
      removeNotification: mockRemove,
    });

    render(<NotificationToast />);

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);

    expect(mockRemove).toHaveBeenCalledWith("1");
  });
});
