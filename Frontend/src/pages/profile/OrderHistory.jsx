import { useEffect, useState } from "react";
import { userAPI } from "../../api/apiClient";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    userAPI.getOrderHistory().then((res) => {
      setOrders(res.data.orders);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="border-b py-4">
          <p className="font-semibold">Order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Items: {order.items.length} • Status: {order.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
