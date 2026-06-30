import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { userAPI } from "../../api/apiClient";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (key) => {
    setShow({ ...show, [key]: !show[key] });
  };

  const validate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return false;
    }
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await userAPI.changePassword(form);
      toast.success("Password updated successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['DM_Sans',sans-serif] text-white max-w-xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white">
          Change Password
        </h2>
        <p className="text-sm text-white/55 mt-1">
          Keep your account secure by using a strong password
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-4 sm:space-y-6">
        {/* Current Password */}
        <div>
          <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
            Current Password
          </label>
          <div className="mt-1.5 relative flex items-center">
            <Lock className="absolute left-3 text-white/45 pointer-events-none" size={18} />
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-white text-[0.9rem] outline-none transition focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              className="absolute right-3 text-white/45 hover:text-white/80 transition"
            >
              {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
            New Password
          </label>
          <div className="mt-1.5 relative flex items-center">
            <Lock className="absolute left-3 text-white/45 pointer-events-none" size={18} />
            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-white text-[0.9rem] outline-none transition focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className="absolute right-3 text-white/45 hover:text-white/80 transition"
            >
              {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-white/45 mt-1.5">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
            Confirm New Password
          </label>
          <div className="mt-1.5 relative flex items-center">
            <Lock className="absolute left-3 text-white/45 pointer-events-none" size={18} />
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-white text-[0.9rem] outline-none transition focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 text-white/45 hover:text-white/80 transition"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 text-[#1a1a1a] font-semibold rounded-xl shadow-[0_4px_20px_rgba(251,191,36,0.4)] transition w-full sm:w-auto disabled:opacity-55 disabled:cursor-not-allowed enabled:hover:bg-amber-300 enabled:hover:-translate-y-px enabled:hover:shadow-[0_8px_28px_rgba(251,191,36,0.5)]"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;