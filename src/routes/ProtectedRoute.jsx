import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = jwtDecode(token);
    const path = location.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isAgentRoute = path.startsWith("/agent");

    const isAuthorized =
      (isAdminRoute && user.role === "admin") ||
      (isAgentRoute && ["karachi-agent", "dubai-agent"].includes(user.role));

    if (!isAuthorized) {
      toast.error("Unauthorized access");
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (err) {
    toast.error("Invalid token");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
