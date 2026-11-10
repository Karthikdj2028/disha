import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ReportPage from "./pages/ReportPage";
import DashboardPage from "./pages/DashboardPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import TeamsPage from "./pages/TeamsPage";
import AssignmentsPage from "./pages/AssignmentsPage";

export default function App() {
  const { i18n } = useTranslation();
  useEffect(() => { document.documentElement.lang = i18n.resolvedLanguage ?? "en"; }, [i18n.resolvedLanguage]);
  return <AuthProvider><Routes>
    <Route path="/report" element={<ReportPage />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/forgot-password" element={<ForgotPassword />} />
    <Route path="/admin" element={<ProtectedRoute><AdminLayout><Navigate to="/admin/dashboard" replace /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/incidents" element={<ProtectedRoute><AdminLayout><IncidentsPage /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/incidents/:id" element={<ProtectedRoute><AdminLayout><IncidentDetailPage /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/teams" element={<ProtectedRoute><AdminLayout><TeamsPage /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/assignments" element={<ProtectedRoute><AdminLayout><AssignmentsPage /></AdminLayout></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/report" replace />} />
  </Routes></AuthProvider>;
}
