import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";
import { FaEye, FaEyeSlash, FaLock, FaRegEnvelope } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_0%,#e0f2fe_0%,#ffffff_60%)]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(13,39,108,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,39,108,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "center",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
            maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
          }}
        />
        <div className="absolute -top-28 -left-32 h-96 w-96 rounded-full bg-[#0d276c]/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-400/25 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(13,39,108,0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <ToastContainer position="top-right" autoClose={2000} pauseOnHover={false} newestOnTop theme="colored" />

      {!loading ? (
        <div className="relative w-full max-w-md p-1">
          <div className="rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="rounded-t-2xl bg-gradient-to-r from-[#0d276c] to-blue-600 p-6">
              <img
                src="https://leaderstaxconsultant.com/wp-content/uploads/2025/08/Leaders-logo-final-white-1.webp"
                alt="Leaders Tax Consultant logo"
                className="mx-auto h-12 w-auto"
              />
            </div>

            <div className="px-6 pb-6 pt-6">
              <div className="mb-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
                <p className="mt-1 text-sm text-gray-600">Log in to continue</p>
              </div>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaRegEnvelope aria-hidden="true" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white/70 px-10 py-2 text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/60"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaLock aria-hidden="true" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white/70 px-10 py-2 pr-12 text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/60"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute top-1 inset-y-0 right-0 mr-2 flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-[#0d276c] focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
                  disabled={loading}
                >
                  <span className="absolute inset-0 -translate-y-full bg-white/15 transition group-hover:translate-y-0" />
                  Login
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-gray-500">Protected area. Authorized users only.</p>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
};

export default Login;
