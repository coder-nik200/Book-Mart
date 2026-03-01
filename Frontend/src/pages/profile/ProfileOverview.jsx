import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, User, Mail, Edit2, Save, X } from "lucide-react";
import { userAPI } from "../../api/apiClient";

const ProfileOverview = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getProfile();
        setProfile(res.data.user);
        setForm({ name: res.data.user.name, email: res.data.user.email });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setSaving(true);
      const res = await userAPI.updateProfile(form);
      setProfile(res.data.user);
      setEdit(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 size={36} className="animate-spin text-blue-600" />
      </div>
    );

  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Profile Information
          </h2>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            View and update your personal details
          </p>
        </div>
        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-2 mt-3 sm:mt-0 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl sm:text-5xl font-bold shadow-inner">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 sm:mt-3 font-semibold text-lg sm:text-xl text-gray-800">
          {profile.name}
        </p>
        <p className="text-sm text-gray-500">{profile.role || "User"}</p>
      </div>

      {/* Form */}
      <div className="space-y-4 sm:space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <div className="mt-1 relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              disabled={!edit}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg transition
                ${edit ? "focus:ring-2 focus:ring-blue-500 bg-white" : "bg-gray-50 cursor-not-allowed"}
              `}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-500">Email Address</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              disabled={!edit}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg transition
                ${edit ? "focus:ring-2 focus:ring-blue-500 bg-white" : "bg-gray-50 cursor-not-allowed"}
              `}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {edit && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={() => {
              setEdit(false);
              setForm({ name: profile.name, email: profile.email });
            }}
            className="flex items-center justify-center gap-2 px-5 py-2 border rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            onClick={updateProfile}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;
