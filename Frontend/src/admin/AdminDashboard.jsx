import { useEffect, useState, useCallback } from "react";
import {
  Users,
  BookOpen,
  ShoppingBag,
  IndianRupee,
  Download,
  Activity,
} from "lucide-react";
import { adminAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import Papa from "papaparse";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");

  /* ================= FETCH DATA ================= */
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboardStats({ days: dateRange });
      setStats(res.data?.data || null);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    if (!stats) return;

    const csv = Papa.unparse([
      ["Metric", "Value"],
      ["Total Users", stats.totalUsers],
      ["Total Books", stats.totalBooks],
      ["Total Orders", stats.totalOrders],
      ["Total Revenue", stats.totalRevenue],
    ]);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dashboard_report.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
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
    <div className="w-full max-w-7xl mx-auto space-y-10 text-white">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-400">
            Overview of platform activity and performance
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-black/40 border border-white/10 rounded px-3 py-2"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
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

      {/* RECENT ACTIVITY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={18} /> Recent Activity
        </h3>

        {stats.recentActivity?.length ? (
          <div className="space-y-4 text-sm">
            {stats.recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-white/10 pb-2"
              >
                <span className="text-gray-200">{item.message}</span>
                <span className="text-gray-400">
                  {new Date(item.time).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            No recent activity
          </p>
        )}
      </div>

      {/* REVENUE TREND */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.revenueByDate}>
              <CartesianGrid stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP SELLING BOOKS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Top Selling Books</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.topSellingBooks}>
              <CartesianGrid stroke="#2a2a2a" />
              <XAxis dataKey="title" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="sales" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ORDER STATUS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Order Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.orderStatusDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {stats.orderStatusDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;