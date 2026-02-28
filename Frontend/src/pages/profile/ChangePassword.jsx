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

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (key) => {
    setShow({ ...show, [key]: !show[key] });
  };

  /* ================= VALIDATION ================= */
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

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await userAPI.changePassword(form);
      toast.success("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 sm:p-8 max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Keep your account secure by using a strong password
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">

        {/* Current Password */}
        <div>
          <label className="text-sm text-gray-600">Current Password</label>
          <div className="relative mt-1">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <div className="relative mt-1">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600">Confirm New Password</label>
          <div className="relative mt-1">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
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