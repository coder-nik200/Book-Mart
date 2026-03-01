import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Admin logged out successfully");
  };

  const navItem =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition";
  const activeItem = "bg-indigo-600 text-white";
  const inactiveItem = "text-gray-300 hover:bg-white/10";

  return (
    <div className="h-screen w-full bg-[#0b0f19] text-white flex overflow-hidden">


      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside
        className={`fixed lg:static z-50 left-0 top-0 h-screen w-64
        bg-black/40 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col`}
      >

        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">BookMart Admin</h2>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <Users size={18} /> Users
          </NavLink>

          <NavLink
            to="/admin/books"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <BookOpen size={18} /> Books
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <ShoppingBag size={18} /> Orders
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2
            rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

   
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

 
        <header className="h-16 flex items-center justify-between px-6
        border-b border-white/10 bg-black/30 backdrop-blur shrink-0">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="text-lg font-semibold">Admin Panel</h1>

          <div className="text-right">
            <div className="text-sm font-medium">
              {user?.name || "Admin"}
            </div>
            <div className="text-xs text-gray-400">
              {user?.email}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;