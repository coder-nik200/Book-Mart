import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Alert from "../components/Alert";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

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

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      const { accessToken, user } = response.data;

      login(user, accessToken);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
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
          Create Your Account
        </h1>
        <p className="text-gray-200 text-center mb-8">
          Join BookMart and start exploring 📚
        </p>

        {errors.submit && (
          <div className="mb-4">
            <Alert type="error" message={errors.submit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
   
          <div>
            <label className="text-sm text-gray-200 mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.name ? "border-red-400" : "border-white/30"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

   
          <div>
            <label className="text-sm text-gray-200 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.email ? "border-red-400" : "border-white/30"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.password ? "border-red-400" : "border-white/30"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.confirmPassword ? "border-red-400" : "border-white/30"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:scale-105 hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:text-yellow-400 transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
