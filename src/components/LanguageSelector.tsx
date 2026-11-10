import { useTranslation } from "react-i18next";
import { supportedLanguages, type SupportedLanguage } from "../lib/i18n";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const current = (supportedLanguages.includes(i18n.resolvedLanguage as SupportedLanguage) ? i18n.resolvedLanguage : "en") as SupportedLanguage;
  return <label className="language-selector"><span>{t("language.label")}</span><select aria-label={t("language.label")} value={current} onChange={(event) => void i18n.changeLanguage(event.target.value)}><option value="en">{t("language.english", { lng: "en" })}</option><option value="ta">{t("language.tamil", { lng: "ta" })}</option><option value="hi">{t("language.hindi", { lng: "hi" })}</option></select></label>;
}
