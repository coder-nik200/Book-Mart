import { useEffect, useState } from "react";
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

/* ================= DEBOUNCE HOOK ================= */
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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sort, debouncedSearch]);

  /* ================= SINGLE ACTION ================= */
  const toggleBlockUser = async (user) => {
    try {
      user.isBlocked
        ? await adminAPI.unblockUser(user._id)
        : await adminAPI.blockUser(user._id);

      toast.success("Action successful");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  /* ================= BULK ACTION ================= */
  const bulkAction = async (type) => {
    try {
      for (const id of selected) {
        type === "block"
          ? await adminAPI.blockUser(id)
          : await adminAPI.unblockUser(id);
      }
      toast.success("Bulk action completed");
      fetchUsers();
    } catch {
      toast.error("Bulk action failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
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
              onClick={() => bulkAction("block")}
              className="px-3 py-2 text-sm bg-red-600/20 text-red-400 rounded-lg"
            >
              Block Selected
            </button>
            <button
              onClick={() => bulkAction("unblock")}
              className="px-3 py-2 text-sm bg-green-600/20 text-green-400 rounded-lg"
            >
              Unblock Selected
            </button>
          </div>
        )}
      </div>

      {/* ================= CONTROLS ================= */}
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
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP / TABLET TABLE ================= */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === users.length && users.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? users.map(u => u._id) : [])
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
                  <div className="w-6 h-6 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
                <tr key={user._id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(user._id)
                            ? prev.filter(id => id !== user._id)
                            : [...prev, user._id]
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.isBlocked ? (
                      <span className="text-red-400">Blocked</span>
                    ) : (
                      <span className="text-green-400">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleBlockUser(user)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                      ${
                        user.isBlocked
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
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

      {/* ================= MOBILE CARDS ================= */}
      <div className="sm:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-400">{user.email}</div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`text-xs ${
                    user.isBlocked ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>

                <button
                  onClick={() => toggleBlockUser(user)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                  ${
                    user.isBlocked
                      ? "bg-green-600/20 text-green-400"
                      : "bg-red-600/20 text-red-400"
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Page {page} of {pages}
        </p>

        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft />
          </button>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;