import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/apiClient";
import { Eye, EyeOff, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.login(formData);
      const { accessToken, user } = response.data;

      if (user.role !== "admin") {
        toast.error("Unauthorized access");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      toast.success("Authenticated");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0f19] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.04)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-10 text-white">


          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                <Lock className="text-indigo-400" size={22} />
              </div>
              <span className="text-sm tracking-widest uppercase text-indigo-300">
                Secure Access
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight">
              Administrator Console
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-sm">
              This area is restricted to authorized administrators only.
            </p>
          </div>

     
          <form onSubmit={handleSubmit} className="space-y-6">

    
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@company.com"
              />
            </div>

       
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

      
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Verifying identity…" : "Enter Admin Console"}
            </button>
          </form>

     
          <div className="mt-10 text-xs text-gray-400 flex justify-between">
            <span>© {new Date().getFullYear()} BookMart</span>
            <span className="opacity-70">Admin Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;