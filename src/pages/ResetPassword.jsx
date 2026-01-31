import { useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleReset = async () => {
    try {
      await API.post("/auth/reset-password", { token, password });
      toast.success("Password reset successful");
      navigate("/");
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h2 className="text-xl mb-4">Reset Password</h2>
        <input type="password" className="border p-2 w-full mb-2" placeholder="New Password" onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 w-full" onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}
