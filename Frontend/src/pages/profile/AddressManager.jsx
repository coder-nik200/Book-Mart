import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2, MapPin, Plus, Check } from "lucide-react";
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

  /* ================= LOAD ADDRESSES ================= */
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

  /* ================= HANDLE FORM ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  /* ================= ADD ADDRESS ================= */
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

  /* ================= DELETE ADDRESS ================= */
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 sm:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Saved Addresses</h2>
          <p className="text-sm text-gray-500">
            Manage your delivery addresses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-12 border rounded-xl bg-gray-50">
          <MapPin size={40} className="mx-auto text-gray-400 mb-4" />
          <p className="font-medium text-gray-600">No addresses saved</p>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{addr.fullName}</p>

                {addr.isDefault && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                    <Check size={12} />
                    Default
                  </span>
                )}

                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                  {addr.addressType}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {addr.street}, {addr.city}, {addr.state}
              </p>
              <p className="text-sm text-gray-600">
                {addr.country} - {addr.zipCode}
              </p>
              <p className="text-sm text-gray-500">
                Phone: {addr.phoneNumber}
              </p>
            </div>

            <button
              onClick={() => deleteAddress(addr._id)}
              disabled={deletingId === addr._id}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
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

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl">

            <h3 className="text-lg font-semibold mb-4">
              Add New Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "fullName",
                "phoneNumber",
                "street",
                "city",
                "state",
                "zipCode",
                "country",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-lg"
                />
              ))}

              <select
                name="addressType"
                value={form.addressType}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg"
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={addAddress}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
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