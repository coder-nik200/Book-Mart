import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Alert from "../components/Alert";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(formData);
      const { accessToken, user } = response.data;

      login(user, accessToken);
      toast.success("Login successful!");

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";

      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-800 px-4 py-10">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-200 text-center mb-8">
          Sign in to your BookMart account
        </p>

        {errors.submit && (
          <div className="mb-4">
            <Alert type="error" message={errors.submit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-gray-200 mb-2 block">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-gray-300"
                size={20}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-gray-300"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-yellow-300 hover:text-yellow-400 transition"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:scale-105 hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-300 font-semibold hover:text-yellow-400 transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;