import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2, MapPin, Plus, Check, X } from "lucide-react";
import { userAPI } from "../../api/apiClient";

const initialForm = {
  fullName: "",
  phoneNumber: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  addressType: "home",
  isDefault: false,
};

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAddresses();
      setAddresses(res.data.addresses);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const addAddress = async () => {
    try {
      setSaving(true);
      await userAPI.addAddress(form);
      toast.success("Address added");
      setShowModal(false);
      setForm(initialForm);
      loadAddresses();
    } catch {
      toast.error("Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      setDeletingId(id);
      await userAPI.deleteAddress(id);
      toast.success("Address removed");
      loadAddresses();
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 size={36} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="font-['DM_Sans',sans-serif] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
        <div>
          <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white">
            Saved Addresses
          </h2>
          <p className="text-sm text-white/55 mt-1">
            Manage your delivery addresses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 text-[#1a1a1a] font-semibold rounded-xl shadow-[0_4px_20px_rgba(251,191,36,0.4)] transition w-full sm:w-auto hover:bg-amber-300 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(251,191,36,0.5)]"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="text-center py-12 border border-white/10 rounded-xl bg-white/[0.03]">
          <MapPin size={40} className="mx-auto text-white/30 mb-4" />
          <p className="font-medium text-white/55">No addresses saved</p>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border border-white/10 bg-white/[0.03] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 transition hover:bg-white/[0.05] hover:border-white/[0.18]"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <p className="font-['Cormorant_Garamond',serif] font-bold text-lg text-white">
                  {addr.fullName}
                </p>

                {addr.isDefault && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-400 rounded-full">
                    <Check size={12} />
                    Default
                  </span>
                )}

                <span className="text-xs px-2 py-0.5 bg-white/[0.08] border border-white/10 text-white/65 rounded-full capitalize">
                  {addr.addressType}
                </span>
              </div>

              <p className="text-sm text-white/65">
                {addr.street}, {addr.city}, {addr.state}
              </p>
              <p className="text-sm text-white/65">
                {addr.country} - {addr.zipCode}
              </p>
              <p className="text-sm text-white/50">Phone: {addr.phoneNumber}</p>
            </div>

            <button
              onClick={() => deleteAddress(addr._id)}
              disabled={deletingId === addr._id}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition self-start sm:self-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === addr._id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh] font-['DM_Sans',sans-serif]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-white">
                Add New Address
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/45 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "fullName", placeholder: "Full Name" },
                { name: "phoneNumber", placeholder: "Phone Number" },
                { name: "street", placeholder: "Street" },
                { name: "city", placeholder: "City" },
                { name: "state", placeholder: "State" },
                { name: "zipCode", placeholder: "Zip Code" },
                { name: "country", placeholder: "Country" },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="bg-white/[0.08] border border-white/[0.18] px-3.5 py-3 rounded-xl w-full text-white text-[0.9rem] placeholder-white/40 outline-none transition focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
                />
              ))}

              <select
                name="addressType"
                value={form.addressType}
                onChange={handleChange}
                className="bg-white/[0.08] border border-white/[0.18] px-3.5 py-3 rounded-xl w-full text-white text-[0.9rem] outline-none transition focus:border-amber-400/70 focus:bg-white/[0.12] focus:ring-[3px] focus:ring-amber-400/15"
              >
                <option value="home" className="bg-[#1a1a1a]">Home</option>
                <option value="office" className="bg-[#1a1a1a]">Office</option>
                <option value="other" className="bg-[#1a1a1a]">Other</option>
              </select>

              <label className="flex items-center gap-2 text-sm text-white/70 col-span-full">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="accent-amber-400"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-white/20 rounded-xl text-white/80 hover:bg-white/[0.08] hover:text-white transition w-full sm:w-auto"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={addAddress}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 text-[#1a1a1a] font-semibold rounded-xl shadow-[0_4px_20px_rgba(251,191,36,0.4)] transition w-full sm:w-auto disabled:opacity-55 disabled:cursor-not-allowed enabled:hover:bg-amber-300 enabled:hover:-translate-y-px enabled:hover:shadow-[0_8px_28px_rgba(251,191,36,0.5)]"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;