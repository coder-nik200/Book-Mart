import React, { useEffect, useState } from "react";
import { orderAPI } from "../api/apiClient";
import { Tag, CheckCircle, CreditCard } from "lucide-react";

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
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading your orders...
      </div>
    );
  if (error)
    return <div className="p-6 text-center text-red-500 text-lg">{error}</div>;
  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        You have no orders yet.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-lg border hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-5 space-y-3">
              
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Tag className="w-5 h-5 mr-1 text-blue-500" />{" "}
                  {order.orderNumber}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderstatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.orderstatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.orderstatus}
                </span>
              </div>

              
              <p className="flex items-center text-gray-700">
                <CreditCard className="w-4 h-4 mr-1 text-purple-500" />
                <strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}
              </p>
              <p className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>
              <p className="text-gray-500 text-sm">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
