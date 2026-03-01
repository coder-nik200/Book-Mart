import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/apiClient";

const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers({
        page,
        limit,
        search: debouncedSearch,
        sort,
      });

      setUsers(res.data.users || []);
      setPages(res.data.pagination?.pages || 1);
      setSelected([]);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBlockUser = async (user) => {
    if (!window.confirm("Are you sure you want to change this user status?"))
      return;

    try {
      setActionLoading(true);
      user.isBlocked
        ? await adminAPI.unblockUser(user._id)
        : await adminAPI.blockUser(user._id);

      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkAction = async (type) => {
    if (!window.confirm(`Are you sure you want to ${type} selected users?`))
      return;

    try {
      setActionLoading(true);

      await Promise.all(
        selected.map((id) =>
          type === "block"
            ? adminAPI.blockUser(id)
            : adminAPI.unblockUser(id)
        )
      );

      toast.success("Bulk action completed");
      fetchUsers();
    } catch {
      toast.error("Bulk action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen overflow-y-auto">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Users size={22} /> Users
          </h1>
          <p className="text-gray-400 mt-1">
            Manage all registered customers
          </p>
        </div>

        {selected.length > 0 && (
          <div className="flex gap-2">
            <button
              disabled={actionLoading}
              onClick={() => bulkAction("block")}
              className="px-4 py-2 text-sm bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition"
            >
              Block Selected
            </button>
            <button
              disabled={actionLoading}
              onClick={() => bulkAction("unblock")}
              className="px-4 py-2 text-sm bg-green-600/20 text-green-400 rounded-xl hover:bg-green-600/30 transition"
            >
              Unblock Selected
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 sticky top-0 backdrop-blur">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selected.length === users.length && users.length > 0
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? users.map((u) => u._id) : []
                    )
                  }
                />
              </th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? "bg-red-600/20 text-red-400"
                          : "bg-green-600/20 text-green-400"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={actionLoading}
                      onClick={() => toggleBlockUser(user)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition ${
                        user.isBlocked
                          ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                          : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <ShieldCheck size={14} /> Unblock
                        </>
                      ) : (
                        <>
                          <ShieldOff size={14} /> Block
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Page {page} of {pages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="disabled:opacity-40"
          >
            <ChevronLeft />
          </button>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;