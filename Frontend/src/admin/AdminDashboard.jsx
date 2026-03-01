// import { useEffect, useState } from "react";
// import {
//   Users,
//   BookOpen,
//   ShoppingBag,
//   IndianRupee,
//   PlusCircle,
// } from "lucide-react";
// import { adminAPI } from "../api/apiClient";
// import toast from "react-hot-toast";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH DASHBOARD STATS ================= */
//   useEffect(() => {
//     const fetchDashboardStats = async () => {
//       try {
//         const res = await adminAPI.getDashboardStats();
//         setStats(res.data.data);
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message || "Failed to load dashboard data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardStats();
//   }, []);

//   /* ================= LOADING STATE ================= */
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!stats) return null;

//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers,
//       icon: Users,
//       color: "bg-indigo-600",
//     },
//     {
//       title: "Total Books",
//       value: stats.totalBooks,
//       icon: BookOpen,
//       color: "bg-emerald-600",
//     },
//     {
//       title: "Total Orders",
//       value: stats.totalOrders,
//       icon: ShoppingBag,
//       color: "bg-orange-600",
//     },
//     {
//       title: "Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
//       icon: IndianRupee,
//       color: "bg-pink-600",
//     },
//   ];

//   return (
//     <div className="space-y-8">

//       {/* ================= PAGE HEADER ================= */}
//       <div>
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <p className="text-gray-400 mt-1">
//           Overview of platform activity and performance
//         </p>
//       </div>

//       {/* ================= STATS GRID ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex items-center justify-between"
//           >
//             <div>
//               <p className="text-sm text-gray-400">{stat.title}</p>
//               <p className="text-2xl font-semibold mt-1">{stat.value}</p>
//             </div>

//             <div
//               className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
//             >
//               <stat.icon size={22} />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= QUICK ACTIONS ================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
//           <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

//           <div className="space-y-3">
//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">
//               <PlusCircle size={18} />
//               Add New Book
//             </button>

//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
//               <Users size={18} />
//               Manage Users
//             </button>

//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
//               <ShoppingBag size={18} />
//               View Orders
//             </button>
//           </div>
//         </div>

//         {/* ================= RECENT ACTIVITY ================= */}
//         <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
//           <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

//           <div className="space-y-4 text-sm text-gray-300">
//             {stats.recentActivity?.length ? (
//               stats.recentActivity.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between border-b border-white/10 pb-2"
//                 >
//                   <span>{item.message}</span>
//                   <span className="text-gray-400">{item.time}</span>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-400">No recent activity</p>
//             )}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ShoppingBag,
  IndianRupee,
  PlusCircle,
} from "lucide-react";
import { adminAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH DASHBOARD STATS ================= */
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        setStats(res.data.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-indigo-600",
    },
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-emerald-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-orange-600",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ================= PAGE HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of platform activity and performance
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <button
              onClick={() =>
                navigate("/admin/books", { state: { openAdd: true } })
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
            >
              <PlusCircle size={18} />
              Add New Book
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <Users size={18} />
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <ShoppingBag size={18} />
              View Orders
            </button>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <div className="space-y-4 text-sm text-gray-300">
            {stats.recentActivity?.length ? (
              stats.recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-white/10 pb-2"
                >
                  <span>{item.message}</span>
                  <span className="text-gray-400">{item.time}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;