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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#1e3a8a] via-45% via-[#312e81] via-80% to-[#0f172a] font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .signup-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .signup-spinner {
          border-top-color: #1a1a1a;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-20 w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3/5 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }}
      />
      <div aria-hidden="true" className="signup-grain pointer-events-none absolute inset-0 opacity-[0.025]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-[22px] sm:rounded-[28px] px-5 py-7 sm:px-8 sm:py-9 shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]">

        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
          <span className="text-[1.3rem]">📖</span>
          <span className="font-['Cormorant_Garamond',serif] text-[1.1rem] font-bold text-white/70 tracking-[0.04em]">
            BookMart
          </span>
        </div>

        <h1 className="font-['Cormorant_Garamond',serif] text-center text-white font-bold tracking-[-0.01em] mb-1.5 text-[1.75rem] sm:text-[2.25rem]">
          Create Your Account
        </h1>
        <p className="text-center text-white/60 text-sm font-light mb-6 sm:mb-7">
          Join BookMart and start exploring 📚
        </p>

        {errors.submit && (
          <div className="mb-4">
            <Alert type="error" message={errors.submit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-[1.1rem]">

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-white/45 pointer-events-none" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                className={`w-full pl-10 pr-3.5 py-3 bg-white/[0.08] border rounded-xl text-white text-[0.9rem] placeholder-white/30 outline-none transition focus:bg-white/[0.12] focus:ring-[3px] ${errors.name
                    ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/15"
                    : "border-white/[0.18] focus:border-amber-400/70 focus:ring-amber-400/15"
                  }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-white/45 pointer-events-none" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full pl-10 pr-3.5 py-3 bg-white/[0.08] border rounded-xl text-white text-[0.9rem] placeholder-white/30 outline-none transition focus:bg-white/[0.12] focus:ring-[3px] ${errors.email
                    ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/15"
                    : "border-white/[0.18] focus:border-amber-400/70 focus:ring-amber-400/15"
                  }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-white/45 pointer-events-none" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full pl-10 pr-11 py-3 bg-white/[0.08] border rounded-xl text-white text-[0.9rem] placeholder-white/30 outline-none transition focus:bg-white/[0.12] focus:ring-[3px] ${errors.password
                    ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/15"
                    : "border-white/[0.18] focus:border-amber-400/70 focus:ring-amber-400/15"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 p-1 text-white/45 rounded-md transition hover:text-white/90 hover:bg-white/[0.08] flex items-center justify-center leading-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-white/45 pointer-events-none" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full pl-10 pr-3.5 py-3 bg-white/[0.08] border rounded-xl text-white text-[0.9rem] placeholder-white/30 outline-none transition focus:bg-white/[0.12] focus:ring-[3px] ${errors.confirmPassword
                    ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/15"
                    : "border-white/[0.18] focus:border-amber-400/70 focus:ring-amber-400/15"
                  }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 min-h-[48px] py-3.5 bg-amber-400 text-[#1a1a1a] text-[0.95rem] font-semibold rounded-xl shadow-[0_4px_20px_rgba(251,191,36,0.4)] transition flex items-center justify-center disabled:opacity-55 disabled:cursor-not-allowed enabled:hover:bg-amber-300 enabled:hover:-translate-y-px enabled:hover:shadow-[0_8px_28px_rgba(251,191,36,0.5)]"
          >
            {loading ? (
              <span className="signup-spinner w-[18px] h-[18px] border-2 border-black/20 rounded-full" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-[0.85rem] text-white/55 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-400 font-semibold no-underline transition hover:text-amber-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;