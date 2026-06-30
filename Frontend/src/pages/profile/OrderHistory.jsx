import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { userAPI } from "../../api/apiClient";

const statusStyles = {
  pending: "bg-amber-400/15 border-amber-400/30 text-amber-400",
  processing: "bg-blue-400/15 border-blue-400/30 text-blue-300",
  shipped: "bg-purple-400/15 border-purple-400/30 text-purple-300",
  delivered: "bg-emerald-400/15 border-emerald-400/30 text-emerald-300",
  cancelled: "bg-red-400/15 border-red-400/30 text-red-300",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getOrderHistory();
        setOrders(res.data.orders);
      } catch {
        // silently fail, empty state will show
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 size={36} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="font-['DM_Sans',sans-serif] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white">
          My Orders
        </h2>
        <p className="text-sm text-white/55 mt-1">
          View your past and current orders
        </p>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="text-center py-12 border border-white/10 rounded-xl bg-white/[0.03]">
          <Package size={40} className="mx-auto text-white/30 mb-4" />
          <p className="font-medium text-white/55">No orders yet</p>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-white/10 bg-white/[0.03] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:bg-white/[0.05] hover:border-white/[0.18]"
          >
            <div>
              <p className="font-['Cormorant_Garamond',serif] font-bold text-lg text-white">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-sm text-white/55 mt-0.5">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </p>
            </div>

            <span
              className={`self-start sm:self-center text-xs px-2.5 py-1 border rounded-full capitalize whitespace-nowrap ${statusStyles[order.status?.toLowerCase()] ||
                "bg-white/[0.08] border-white/10 text-white/65"
                }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;