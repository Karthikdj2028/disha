import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { requestPasswordReset } from "../services/authService";
import LanguageSelector from "../components/LanguageSelector";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const { t } = useTranslation();
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setMessage(""); try { await requestPasswordReset(email); setMessage(t("auth.resetSent")); } catch { setError(t("auth.resetError")); } finally { setLoading(false); } }
  return <main className="auth-page"><section className="auth-card"><div className="auth-topline"><div className="brand brand-dark"><ShieldAlert size={25} /><div><strong>{t("app.name")}</strong><span>{t("auth.portal")}</span></div></div><LanguageSelector /></div><div className="eyebrow recovery-label"><KeyRound size={15} /> {t("auth.resetTitle")}</div><h1>{t("auth.resetTitle")}</h1><p className="muted">{t("auth.resetDescription")}</p><form onSubmit={submit} className="stack-form"><label>{t("auth.email")}<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{message && <div className="alert" role="status">{message}</div>}{error && <div className="alert error" role="alert">{error}</div>}<button className="button primary full" disabled={loading}>{loading ? t("auth.sending") : t("auth.resetAction")}</button></form><Link className="back-link" to="/admin/login">{t("auth.backToSignIn")}</Link></section></main>;
}
