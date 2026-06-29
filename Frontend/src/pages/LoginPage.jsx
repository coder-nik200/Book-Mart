import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Alert from "../components/Alert";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <style>{styles}</style>

      {/* Background orbs */}
      <div className="login-orb login-orb1" aria-hidden="true" />
      <div className="login-orb login-orb2" aria-hidden="true" />
      <div className="login-orb login-orb3" aria-hidden="true" />
      <div className="login-grain" aria-hidden="true" />

      {/* Card */}
      <div className="login-card">

        {/* Brand mark */}
        <div className="login-brand">
          <span className="login-brand-icon">📖</span>
          <span className="login-brand-name">BookMart</span>
        </div>

        <h1 className="login-title">Welcome Back 👋</h1>
        <p className="login-sub">Sign in to your BookMart account</p>

        {errors.submit && (
          <div className="mb-4">
            <Alert type="error" message={errors.submit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <Mail className="login-input-icon" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="login-input"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <Lock className="login-input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="login-input login-input--password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="login-eye-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="login-forgot-row">
            <Link to="/forgot-password" className="login-forgot">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="login-signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── ROOT ────────────────────────────────────────── */
  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 45%, #312e81 80%, #0f172a 100%);
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── ORBS ────────────────────────────────────────── */
  .login-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
  }
  .login-orb1 {
    width: 380px; height: 380px;
    top: -120px; left: -80px;
    background: radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%);
  }
  .login-orb2 {
    width: 320px; height: 320px;
    bottom: -100px; right: -60px;
    background: radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%);
  }
  .login-orb3 {
    width: 220px; height: 220px;
    top: 50%; left: 60%;
    background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
  }

  /* ── GRAIN ───────────────────────────────────────── */
  .login-grain {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
  }

  /* ── CARD ────────────────────────────────────────── */
  .login-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 28px;
    padding: 2.25rem 2rem;
    box-shadow:
      0 8px 40px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }

  @media (max-width: 480px) {
    .login-card { padding: 1.75rem 1.25rem; border-radius: 22px; }
  }

  /* ── BRAND ───────────────────────────────────────── */
  .login-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .login-brand-icon { font-size: 1.3rem; }
  .login-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
  }

  /* ── HEADING ─────────────────────────────────────── */
  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.75rem, 5vw, 2.25rem);
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: 0.35rem;
    letter-spacing: -0.01em;
  }

  .login-sub {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.6);
    text-align: center;
    margin-bottom: 1.75rem;
    font-weight: 300;
  }

  /* ── FORM ────────────────────────────────────────── */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .login-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.03em;
  }

  /* Input wrapper */
  .login-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .login-input-icon {
    position: absolute;
    left: 12px;
    color: rgba(255,255,255,0.45);
    pointer-events: none;
    flex-shrink: 0;
  }

  .login-input {
    width: 100%;
    padding: 0.75rem 0.875rem 0.75rem 2.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .login-input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .login-input:focus {
    border-color: rgba(251,191,36,0.7);
    background: rgba(255,255,255,0.12);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.15);
  }

  /* Password field — extra right padding for eye button */
  .login-input--password {
    padding-right: 2.75rem;
  }

  /* ── EYE BUTTON (fixed) ──────────────────────────── */
  .login-eye-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: rgba(255,255,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    line-height: 0;
  }

  .login-eye-btn:hover {
    color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.08);
  }

  /* ── FORGOT ROW ──────────────────────────────────── */
  .login-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -0.35rem;
  }
  .login-forgot {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color 0.15s;
  }
  .login-forgot:hover { color: #fbbf24; }

  /* ── SUBMIT ──────────────────────────────────────── */
  .login-submit-btn {
    width: 100%;
    padding: 0.85rem;
    margin-top: 0.25rem;
    background: #fbbf24;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(251,191,36,0.4);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }

  .login-submit-btn:hover:not(:disabled) {
    background: #fcd34d;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(251,191,36,0.5);
  }

  .login-submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  /* Spinner inside button */
  .login-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #1a1a1a;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── FOOTER ──────────────────────────────────────── */
  .login-footer {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.55);
    margin-top: 1.5rem;
  }

  .login-signup-link {
    color: #fbbf24;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
  }

  .login-signup-link:hover { color: #fcd34d; }
`;

export default LoginPage;