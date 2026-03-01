import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/apiClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllOrders();
      setOrders(res.data.orders || res.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await adminAPI.updateOrderStatus(orderId, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full gap-6 text-white">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Manage Orders</h2>
        <p className="text-gray-400 text-sm mt-1">
          View and manage all customer orders
        </p>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400 p-10">
            No orders found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 sticky top-0">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-white/5"
                >
                  <td className="p-4">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{order.user?.name || "Guest"}</span>
                      <span className="text-xs text-gray-400">
                        {order.user?.email}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "delivered"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    <select
                      disabled={updatingId === order._id}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-black/40 border border-white/10 rounded px-3 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;