import { useEffect, useState, useRef, useCallback } from "react";

export type SSEStatus = "connecting" | "open" | "closed" | "error";

interface UseSSEOptions<T> {
  onMessage?: (data: T) => void;
  onError?: (event: Event) => void;
  onOpen?: (event: Event) => void;
  eventNames?: string[];
  enabled?: boolean;
}

/**
 * A robust hook for Server-Sent Events (SSE) with exponential backoff.
 *
 * @param url The SSE endpoint URL
 * @param options Configuration options for event handlers and behavior
 * @returns { data, status, error, close }
 */
export function useSSE<T = unknown>(
  url: string,
  options: UseSSEOptions<T> = {},
): {
  data: T | null;
  status: SSEStatus;
  error: Event | null;
  close: () => void;
} {
  const { onMessage, onError, onOpen, eventNames, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<SSEStatus>("closed");
  const [error, setError] = useState<Event | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  // Keep latest handlers in refs to avoid reconnection on handler change
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
  }, [onMessage, onError, onOpen]);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cleanup();
    setStatus("closed");
  }, [cleanup]);

  const connect = useCallback(() => {
    if (!url || !enabled) return;

    setStatus("connecting");

    const es = new EventSource(url);
    eventSourceRef.current = es;

    const handleOpen = (e: Event) => {
      setStatus("open");
      setError(null);
      retryCountRef.current = 0; // Reset retry count after successful connection
      onOpenRef.current?.(e);
    };

    const handleError = (e: Event) => {
      // Connection lost or failed
      setStatus("error");
      setError(e);
      onErrorRef.current?.(e);

      // Clean up current connection
      cleanup();

      // Exponential backoff: 1s, 2s, 4s, 8s, ... max 30s
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);

      console.warn(`SSE connection failed. Retrying in ${delay}ms...`);

      retryTimeoutRef.current = setTimeout(() => {
        retryCountRef.current++;
        connect();
      }, delay);
    };

    const handleMessage = (e: MessageEvent) => {
      try {
        const parsedData = JSON.parse(e.data);
        setData(parsedData);
        onMessageRef.current?.(parsedData);
      } catch (err) {
        // If not JSON, return as is
        setData(e.data as unknown as T);
        onMessageRef.current?.(e.data as unknown as T);
        console.error("Failed to parse SSE message:", err);
      }
    };

    es.addEventListener("open", handleOpen);
    es.addEventListener("error", handleError);
    es.addEventListener("message", handleMessage);

    if (eventNames) {
      eventNames.forEach((name) => {
        es.addEventListener(name, handleMessage);
      });
    }
  }, [url, enabled, eventNames, cleanup]);

  useEffect(() => {
    // Reset connection state when configuration changes
    retryCountRef.current = 0;
    setData(null);
    setError(null);

    if (url && enabled) {
      connect();
    } else {
      close();
    }

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, JSON.stringify(eventNames)]);

  return { data, status, error, close };
}
