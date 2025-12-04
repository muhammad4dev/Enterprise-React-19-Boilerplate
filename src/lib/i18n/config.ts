import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { APP_CONFIG } from "@/config/constants";

import arCommon from "./locales/ar.json";
import enCommon from "./locales/en.json";

// In a real app, you might lazily load these, but for a starter, bundling them is fine.
export const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
};

export const defaultNS = "common";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: localStorage.getItem("app_locale") || APP_CONFIG.defaultLanguage, // prioritized over detector for consistency
    fallbackLng: APP_CONFIG.defaultLanguage,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app_locale",
    },
  });

export type SupportedLanguage = keyof typeof resources;
export const supportedLanguages = Object.keys(resources);

export default i18n;
