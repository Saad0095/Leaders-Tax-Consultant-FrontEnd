import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import AllLeads from "./pages/leads/AllLeads";
import MyLeads from "./pages/leads/MyLeads";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import AgentManagement from "./pages/agents/AgentManagement";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AllLeads />} />
          <Route path="/admin/agents" element={<AgentManagement />} />

          {/* Agent */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/leads" element={<MyLeads />} />
        </Route>
      </Route>

      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}

export default App;
