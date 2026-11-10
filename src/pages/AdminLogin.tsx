import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signInAdmin } from "../services/authService";
import LanguageSelector from "../components/LanguageSelector";

function readableAuthError(error: unknown): string { if (error instanceof Error && error.message.includes("not authorized")) return "auth.unauthorized"; return "auth.signInError"; }

export default function AdminLogin() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate(); const location = useLocation(); const { t } = useTranslation();
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); try { await signInAdmin(email, password); navigate((location.state as { from?: string } | null)?.from ?? "/admin/dashboard", { replace: true }); } catch (reason) { setError(readableAuthError(reason)); } finally { setLoading(false); } }
  return <main className="auth-page"><section className="auth-card"><div className="auth-topline"><div className="brand brand-dark"><ShieldCheck size={25} /><div><strong>{t("app.name")}</strong><span>{t("auth.portal")}</span></div></div><LanguageSelector /></div><h1>{t("auth.signIn")}</h1><p className="muted">{t("auth.signInDescription")}</p><form onSubmit={submit} className="stack-form"><label>{t("auth.email")}<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>{t("auth.password")}<div className="password-field"><input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="field-icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <div className="alert error" role="alert">{t(error)}</div>}<button className="button primary full" disabled={loading}>{loading ? t("auth.verifying") : t("auth.signInAction")}</button></form><div className="auth-links"><Link className="back-link" to="/admin/forgot-password">{t("auth.forgotPassword")}</Link><Link className="back-link" to="/report">{t("auth.publicReporting")}</Link></div></section></main>;
}
