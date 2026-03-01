import { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/apiClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllOrders();
      setOrders(res.data.orders || []);
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
  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await adminAPI.updateOrderStatus(orderId, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderstatus: status }
            : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-white">

      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingBag size={22} /> Orders
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Update order status (Pending / Delivered)
        </p>
      </div>
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-white/5 sticky top-0 backdrop-blur">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Loader2 className="mx-auto animate-spin text-indigo-500" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium">
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

                  <td className="p-4 font-semibold">
                    ₹{order.totalPrice?.toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderstatus === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {order.orderstatus}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    <select
                      disabled={updatingId === order._id}
                      value={order.orderstatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  #{order._id.slice(-6)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.orderstatus === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {order.orderstatus}
                </span>
              </div>

              <div className="text-sm text-gray-300">
                {order.user?.name || "Guest"}
              </div>

              <div className="text-sm">
                ₹{order.totalPrice?.toLocaleString("en-IN")}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>

                <select
                  disabled={updatingId === order._id}
                  value={order.orderstatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;