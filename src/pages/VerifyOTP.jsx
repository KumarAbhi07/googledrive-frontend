import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Please register first");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success(response.data.message || "Email verified successfully!");
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);

    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("OTP resent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0a0f5c]/10 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-[#0a0f5c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 text-sm">Enter the 6-digit code sent to</p>
            <p className="text-[#0a0f5c] font-semibold text-sm break-all">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-xl focus:border-[#0a0f5c] focus:outline-none transition duration-200"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#0a0f5c] hover:bg-[#0b1372] text-white font-bold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-[#0a0f5c] hover:text-[#0b1372] font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Having trouble? <a href="mailto:support@example.com" className="text-[#0a0f5c] hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
}
