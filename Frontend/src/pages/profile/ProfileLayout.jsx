import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, MapPin, Lock, Package } from "lucide-react";

const ProfileLayout = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium
     ${
       isActive
         ? "bg-blue-600 text-white shadow"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <section className="bg-gray-50 min-h-screen pt-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= MOBILE HEADER ================= */}
        <div className="md:hidden flex items-center justify-between bg-white rounded-xl shadow px-4 py-3 mb-4">
          <h2 className="text-lg font-semibold">My Account</h2>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {/* ================= SIDEBAR ================= */}
          <aside
            className={`
              fixed md:static
              top-16 md:top-auto
              inset-x-0 bottom-0
              z-40 md:z-auto
              bg-white md:bg-transparent
              transition-transform duration-300
              ${open ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
            `}
          >
            {/* Overlay (mobile only, below navbar) */}
            <div
              className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Panel */}
            <div className="relative bg-white h-full w-72 md:w-full rounded-none md:rounded-2xl shadow md:shadow p-6 z-45">

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  U
                </div>
                <div>
                  <p className="font-semibold text-gray-900">My Account</p>
                  <p className="text-sm text-gray-500">
                    Manage your profile
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <NavLink to="/profile" end className={linkClass} onClick={() => setOpen(false)}>
                  <User size={18} /> Profile
                </NavLink>

                <NavLink to="/profile/addresses" className={linkClass} onClick={() => setOpen(false)}>
                  <MapPin size={18} /> Addresses
                </NavLink>

                <NavLink to="/profile/security" className={linkClass} onClick={() => setOpen(false)}>
                  <Lock size={18} /> Change Password
                </NavLink>

                <NavLink to="/profile/orders" className={linkClass} onClick={() => setOpen(false)}>
                  <Package size={18} /> Orders
                </NavLink>
              </nav>
            </div>
          </aside>

          {/* ================= CONTENT ================= */}
          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLayout;