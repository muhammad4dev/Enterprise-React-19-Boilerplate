import {
  useNavigate,
  useParams,
  type NavigateOptions,
} from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * A wrapper around TanStack Router's `useNavigate` that automatically injects
 * the current language param (`lang`) into destination routes.
 *
 * Usage:
 * const navigate = useAppNavigate();
 * navigate({ to: '/dashboard' }); // Automatically goes to /en/dashboard (or current lang)
 */
export function useAppNavigate() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  return useCallback(
    (options: NavigateOptions) => {
      const currentLang = (params as unknown as { lang?: string })?.lang;

      return navigate({
        ...options,
        params: {
          lang: currentLang,
          ...((options.params || {}) as object),
        } as object,
      } as NavigateOptions);
    },
    [navigate, params],
  );
}
