import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock EventSource globally
class MockEventSource {
  url: string;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onopen: ((ev: Event) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  readyState: number = 0;

  constructor(url: string) {
    this.url = url;
  }

  close() {
    this.readyState = 2; // CLOSED
  }

  addEventListener(_type: string, _listener: EventListener) {}
  removeEventListener(_type: string, _listener: EventListener) {}
}

vi.stubGlobal("EventSource", MockEventSource);
