import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { email, password });
      toast.success("Registration successful");
      navigate("/");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 w-full" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}
