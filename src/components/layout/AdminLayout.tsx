import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, GitBranch, LayoutDashboard, LogOut, Menu, ShieldAlert, Users, X } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const links = [{ to: "/admin/dashboard", label: t("navigation.overview"), icon: LayoutDashboard }, { to: "/admin/incidents", label: t("navigation.incidents"), icon: ClipboardList }, { to: "/admin/teams", label: t("navigation.teams"), icon: Users }, { to: "/admin/assignments", label: t("navigation.assignments"), icon: GitBranch }];
  async function handleLogout() { await logout(); navigate("/admin/login", { replace: true }); }
  return <div className="admin-shell">
    {open && <button className="mobile-scrim" aria-label={t("navigation.workspace")} onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand"><ShieldAlert size={25} /><div><strong>DIASA</strong><span>{t("app.emergencyResponse")}</span></div><button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label={t("navigation.workspace")}><X size={19} /></button></div>
      <p className="nav-label">{t("navigation.workspace")}</p>
      <nav>{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className={location.pathname.startsWith(to) ? "nav-link active" : "nav-link"}><Icon size={18} />{label}</Link>)}</nav>
      <div className="sidebar-footer"><div className="user-chip"><span>{(user?.email?.[0] ?? "A").toUpperCase()}</span><div><strong>{t("navigation.administrator")}</strong><small>{user?.email ?? t("navigation.authorizedAccount")}</small></div></div><button className="logout-button" onClick={handleLogout}><LogOut size={16} /> {t("navigation.signOut")}</button></div>
    </aside>
    <main className="admin-main"><header className="topbar"><button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label={t("navigation.workspace")}><Menu size={21} /></button><div><span className="eyebrow">DIASA / {t("navigation.workspace")}</span><h1>{location.pathname.includes("incidents") ? t("navigation.incidents") : location.pathname.includes("teams") ? t("navigation.teams") : location.pathname.includes("assignments") ? t("navigation.assignments") : t("navigation.overview")}</h1></div><LanguageSelector /></header><div className="page-content">{children}</div></main>
  </div>;
}