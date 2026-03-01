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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
     
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Keep your account secure by using a strong password
        </p>
      </div>


      <div className="space-y-4 sm:space-y-6">
    
        <div>
          <label className="text-sm text-gray-600">Current Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
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

    
        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
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

        <div>
          <label className="text-sm text-gray-600">Confirm New Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
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

  
        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 w-full sm:w-auto transition"
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
