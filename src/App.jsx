import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import AllLeads from "./pages/leads/AllLeads";
import MyLeads from "./pages/leads/MyLeads";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import AgentManagement from "./pages/agents/AgentManagement";
import NotFound from "./pages/auth/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { ToastContainer } from "react-toastify";
import Notifications from "./pages/system/Notifications";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leads" element={<AllLeads />} />
            <Route path="/admin/agents" element={<AgentManagement />} />
            <Route path="/admin/notifications" element={<Notifications />} />

            {/* Agent */}
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/leads" element={<MyLeads />} />
            <Route path="/agent/notifications" element={<Notifications />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
