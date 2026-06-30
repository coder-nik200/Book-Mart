import React, { useEffect, useState } from "react";
import { orderAPI } from "../api/apiClient";
import { Tag, CheckCircle, CreditCard, Loader2, PackageX } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-400/15 border-amber-400/30 text-amber-400",
  completed: "bg-emerald-400/15 border-emerald-400/30 text-emerald-300",
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders();
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your orders.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-[#121212]">
        <Loader2 size={36} className="animate-spin text-amber-400" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-400 text-base bg-[#121212] min-h-screen font-['DM_Sans',sans-serif]">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] p-4 sm:p-6 md:p-8 font-['DM_Sans',sans-serif] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-white">
            Your Orders
          </h1>
          <p className="text-sm text-white/55 mt-1">
            Track and review your past purchases
          </p>
        </div>

        {!orders.length ? (
          <div className="text-center py-12 border border-white/10 rounded-xl bg-white/[0.03]">
            <PackageX size={40} className="mx-auto text-white/30 mb-4" />
            <p className="font-medium text-white/55">You have no orders yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/[0.03] border border-white/10 rounded-xl transition hover:bg-white/[0.05] hover:border-white/[0.18]"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-5 h-5 text-amber-400" />
                      {order.orderNumber}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[order.orderstatus] ||
                        "bg-white/[0.08] border-white/10 text-white/65"
                        }`}
                    >
                      {order.orderstatus}
                    </span>
                  </div>

                  <p className="flex items-center gap-1.5 text-white/70 text-sm">
                    <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-medium text-white/85">Total:</span>{" "}
                    ₹{order.totalPrice.toFixed(2)}
                  </p>
                  <p className="flex items-center gap-1.5 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-white/85">Payment Status:</span>{" "}
                    {order.paymentStatus}
                  </p>
                  <p className="text-white/45 text-xs sm:text-sm">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;