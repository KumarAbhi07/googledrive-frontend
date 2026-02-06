import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    const newErrors = {};

    // Check if all fields are filled
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
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
          </div>
          
          <div className="relative flex flex-col h-full items-center text-center justify-center gap-4">
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
          <h2 className="text-2xl font-bold mb-6 text-center text-[#0a0f5c] tracking-wide">Create Account</h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
                disabled={loading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2.5 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#0a0f5c]"
                }`}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a0f5c] hover:bg-[#0b1372] disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-md transition duration-200 tracking-wide"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 tracking-wide">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0a0f5c] hover:text-[#0b1372] font-semibold"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
