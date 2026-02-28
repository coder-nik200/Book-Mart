import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Mail, Edit2, Save, Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { userAPI } from "../api/apiClient";

const ProfilePage = () => {
  const { setUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getProfile();

        setProfile(res.data.user);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);

      const res = await userAPI.updateProfile(formData);

      setProfile(res.data.user);
      setUser(res.data.user); // update AuthContext

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (!profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Unable to load profile
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-500 text-sm">
              View and manage your account details
            </p>
          </div>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <p className="mt-3 text-lg font-semibold">
              {profile.name}
            </p>
            <p className="text-sm text-gray-500">
              {profile.role}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">
                Full Name
              </label>

              {editMode ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1 text-gray-800">
                  <User size={18} />
                  {profile.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-500">
                Email Address
              </label>

              {editMode ? (
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1 text-gray-800">
                  <Mail size={18} />
                  {profile.email}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {editMode && (
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;