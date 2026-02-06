import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const resolvedUserName =
        res.data?.user?.name ||
        res.data?.user?.fullName ||
        res.data?.name ||
        res.data?.userName ||
        "";
      const resolvedUserEmail = res.data?.user?.email || res.data?.email || email;
      if (resolvedUserName) {
        localStorage.setItem("userName", resolvedUserName);
      } else {
        localStorage.removeItem("userName");
      }
      if (resolvedUserEmail) {
        localStorage.setItem("userEmail", resolvedUserEmail);
      }
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 font-sans antialiased">
      <div className="w-full max-w-6xl min-h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 md:gap-6">
        <div className="relative bg-[#0a0f5c] text-white p-12 md:p-14 flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-20 h-40 border border-white/40" />
            <div className="absolute bottom-12 right-20 w-28 h-20 border border-white/30" />
            <div className="absolute top-1/2 right-6 w-16 h-28 border border-white/20" />
          </div>          <div className="relative flex flex-col h-full items-center text-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
              <span className="text-[#0a0f5c] font-bold">G</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug tracking-tight">
              Google <span className="font-extrabold">Drive</span>
            </h2>
            <p className="text-sm text-blue-100 tracking-wide text-center">Secure online storage</p>
          </div>
        </div>
        <div className="p-12 md:p-14 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#0a0f5c] tracking-wide">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-[#0a0f5c] hover:text-[#0b1372] font-semibold">
                forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a0f5c] hover:bg-[#0b1372] disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-md transition duration-200 tracking-wide"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 tracking-wide">
            Don&apos;t have any account?{" "}
            <Link to="/register" className="text-[#0a0f5c] hover:text-[#0b1372] font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
