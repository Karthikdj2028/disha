import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useTranslation("common");
  const location = useLocation();
  if (loading) return <div className="screen-state">{t("auth.verifying")}</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}
