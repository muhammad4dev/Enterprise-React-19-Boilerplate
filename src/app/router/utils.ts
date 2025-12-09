import { redirect } from "@tanstack/react-router";

import { APP_CONFIG } from "@/config/constants";
import type { SupportedLanguage } from "@/lib/i18n/config";

/**
 * Creates a redirect with the language parameter automatically pre-filled.
 * Useful in route `beforeLoad` guards.
 *
 * @param options - Redirect options (to, params, search, etc.)
 * @param currentParams - The current route params (containing lang)
 */
export function appRedirect(
  options: Parameters<typeof redirect>[0],
  currentParams?: { lang?: string },
) {
  let lang: string | undefined = currentParams?.lang;

  if (!lang && typeof window !== "undefined") {
    const pathLang = location.pathname.split("/")[1];
    if (pathLang) {
      lang = pathLang as SupportedLanguage;
    }
  }

  if (!lang) {
    lang = APP_CONFIG.defaultLanguage;
  }

  return redirect({
    ...options,
    params: {
      lang,
      ...((options.params || {}) as object),
    } as object,
  } as Parameters<typeof redirect>[0]);
}
