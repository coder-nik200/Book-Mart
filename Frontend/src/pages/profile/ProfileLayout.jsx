import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, MapPin, Lock, Package, User2 } from "lucide-react";

const ProfileLayout = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium
     ${
       isActive
         ? "bg-amber-400 text-[#1a1a1a] shadow-[0_4px_18px_rgba(251,191,36,0.35)]"
         : "text-white/70 hover:bg-white/[0.08] hover:text-white"
     }`;

  return (
    <section className="relative min-h-screen pt-6 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#1e3a8a] via-45% via-[#312e81] via-80% to-[#0f172a] font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .profile-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
      `}</style>

      {/* Background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-20 w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-3/5 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }}
      />
      <div aria-hidden="true" className="profile-grain pointer-events-none absolute inset-0 opacity-[0.025]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-10">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-4 py-3 mb-4">
          <h2 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-white">
            My Account
          </h2>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <aside
            className={`
              fixed md:static
              top-16 md:top-auto
              inset-x-0 bottom-0
              z-40 md:z-auto
              bg-transparent
              transition-transform duration-300
              ${open ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
            `}
          >
            {/* Mobile overlay */}
            <div
              className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <div className="relative bg-[#1c1a3a]/95 md:bg-white/[0.07] backdrop-blur-2xl border border-white/15 h-full w-72 md:w-full rounded-tr-2xl rounded-br-2xl md:rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] md:shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-6 z-50">

              {/* Close button (mobile) */}
              <button
                onClick={() => setOpen(false)}
                className="md:hidden absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X size={22} />
              </button>

              {/* Brand / user block */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <User2 size={22} />
                </div>
                <div>
                  <p className="font-['Cormorant_Garamond',serif] font-bold text-white text-base">
                    My Account
                  </p>
                  <p className="text-xs text-white/50">Manage your profile</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-2">
                <NavLink
                  to="/profile"
                  end
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <User size={18} /> Profile
                </NavLink>

                <NavLink
                  to="/profile/addresses"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <MapPin size={18} /> Addresses
                </NavLink>

                <NavLink
                  to="/profile/security"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <Lock size={18} /> Change Password
                </NavLink>

                <NavLink
                  to="/profile/orders"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <Package size={18} /> Orders
                </NavLink>
              </nav>
            </div>
          </aside>

          {/* Content panel */}
          <div className="md:col-span-3">
            <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-5 sm:p-6 md:p-8 text-white">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLayout;