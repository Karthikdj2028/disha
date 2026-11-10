import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/common.json";
import ta from "../locales/ta/common.json";
import hi from "../locales/hi/common.json";
import { operationsTranslations } from "../locales/operations";

export const supportedLanguages = ["en", "ta", "hi"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: { en: { common: en, operations: operationsTranslations.en }, ta: { common: ta, operations: operationsTranslations.ta }, hi: { common: hi, operations: operationsTranslations.hi } },
  ns: ["common", "operations"], defaultNS: "common", fallbackLng: "en", supportedLngs: supportedLanguages,
  detection: { order: ["localStorage", "navigator"], caches: ["localStorage"], lookupLocalStorage: "diasa-language" },
  interpolation: { escapeValue: false }, react: { useSuspense: false },
});

export default i18n;
