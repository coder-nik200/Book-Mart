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
        <Loader2 size={36} className="animate-spin text-amber-400" />
      </div>
    );

  if (!profile) return null;

  return (
    <div className="font-['DM_Sans',sans-serif] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
        <div>
          <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white">
            Profile Information
          </h2>
          <p className="text-sm text-white/55 mt-1">
            View and update your personal details
          </p>
        </div>
        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/[0.08] hover:text-white transition"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 text-4xl sm:text-5xl font-bold shadow-inner">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 sm:mt-3 font-['Cormorant_Garamond',serif] font-bold text-lg sm:text-xl text-white">
          {profile.name}
        </p>
        <p className="text-sm text-white/50">{profile.role || "User"}</p>
      </div>

      {/* Fields */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
            Full Name
          </label>
          <div className="mt-1.5 relative flex items-center">
            <User className="absolute left-3 text-white/45 pointer-events-none" size={18} />
            <input
              disabled={!edit}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-3 border rounded-xl text-white text-[0.9rem] outline-none transition
                ${edit
                  ? "bg-white/[0.08] border-white/[0.18] focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
                  : "bg-white/[0.03] border-white/10 text-white/60 cursor-not-allowed"
                }
              `}
            />
          </div>
        </div>

        <div>
          <label className="text-[0.78rem] font-medium text-white/65 tracking-[0.03em]">
            Email Address
          </label>
          <div className="mt-1.5 relative flex items-center">
            <Mail className="absolute left-3 text-white/45 pointer-events-none" size={18} />
            <input
              disabled={!edit}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-3 border rounded-xl text-white text-[0.9rem] outline-none transition
                ${edit
                  ? "bg-white/[0.08] border-white/[0.18] focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
                  : "bg-white/[0.03] border-white/10 text-white/60 cursor-not-allowed"
                }
              `}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {edit && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => {
              setEdit(false);
              setForm({ name: profile.name, email: profile.email });
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-white/20 rounded-xl text-white/80 hover:bg-white/[0.08] hover:text-white transition w-full sm:w-auto"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            onClick={updateProfile}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 text-[#1a1a1a] font-semibold rounded-xl shadow-[0_4px_20px_rgba(251,191,36,0.4)] transition w-full sm:w-auto disabled:opacity-55 disabled:cursor-not-allowed enabled:hover:bg-amber-300 enabled:hover:-translate-y-px enabled:hover:shadow-[0_8px_28px_rgba(251,191,36,0.5)]"
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