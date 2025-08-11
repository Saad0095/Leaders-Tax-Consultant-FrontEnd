import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  console.log("API Base URL:", import.meta.env.VITE_BASE_URL);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", response.token);
      const { role } = jwtDecode(response.token);

      toast.success(response.message || "Logged in!");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "karachi-agent" || role === "dubai-agent") {
          navigate("/agent/dashboard");
        } else {
          navigate("/login");
        }
      }, 500);
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error?.response?.data?.error || "Something went wrong!";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-700">
      <ToastContainer />
      {!loading ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <img
              src="https://leaderstaxconsultant.com/wp-content/uploads/2025/08/Leaders-logo-final-white-1.webp"
              alt="Leaders Tax Collection"
              className="w-40 mx-auto invert"
            />
          </div>
          <h2 className="text-4xl font-bold text-center text-primary mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-700 mb-6">Login In to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // toggle type
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline focus:outline-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#0d276c] text-white font-semibold py-2 rounded-lg transition-all cursor-pointer"
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Login;
