import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaHeart,
  FaShoppingCart,
  FaCalendarAlt,
  FaBoxes,
  FaRupeeSign,
} from "react-icons/fa";
import { cartAPI, wishlistAPI, orderAPI } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartRes, wishlistRes, ordersRes] = await Promise.all([
          cartAPI.getCart(),
          wishlistAPI.getWishlist(),
          orderAPI.getUserOrders({ limit: 5 }),
        ]);

        setCartItems(cartRes.data.cart || []);
        setWishlistItems(wishlistRes.data.wishlist || []);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-500">
          Here’s a quick overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-lg rounded-xl p-6 flex items-center gap-4 cursor-pointer border border-yellow-200 transition"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart size={32} className="text-yellow-600" />
          <div>
            <p className="text-gray-600 text-sm">Cart Items</p>
            <p className="text-2xl font-bold">{cartItems.totalItems || 0}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-100 to-pink-50 shadow-lg rounded-xl p-6 flex items-center gap-4 cursor-pointer border border-red-200 transition"
          onClick={() => navigate("/wishlist")}
        >
          <FaHeart size={32} className="text-red-500" />
          <div>
            <p className="text-gray-600 text-sm">Wishlist Items</p>
            <p className="text-2xl font-bold">{wishlistItems.length}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-indigo-100 to-blue-50 shadow-lg rounded-xl p-6 flex items-center gap-4 cursor-pointer border border-indigo-200 transition"
          onClick={() => navigate("/orders")}
        >
          <FaBook size={32} className="text-indigo-600" />
          <div>
            <p className="text-gray-600 text-sm">Recent Orders</p>
            <p className="text-2xl font-bold">{recentOrders.length}</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 py-4">
            You haven’t purchased any books yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {recentOrders.map((order, index) => (
              <li
                key={order._id || index}
                className="p-4 border rounded-lg hover:shadow-lg hover:bg-gray-50 transition cursor-pointer flex flex-col gap-2"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <p className="text-gray-800 font-medium text-lg">
                  {order.items[0]?.book?.title || "Unknown Book"}
                </p>

                <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaBoxes className="text-green-500" />
                    <span>{order.items.length} items</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaRupeeSign className="text-yellow-600" />
                    <span>{order.totalPrice}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Wishlist Preview
        </h2>

        {wishlistItems.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.slice(0, 8).map((book, idx) => (
              <motion.div
                key={book._id || book.id || idx}
                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-transform duration-300"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/wishlist");
                }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`http://localhost:5000${book.image?.url}`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-3 text-center">
                  <p className="text-sm font-medium truncate text-gray-800">
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {book.author}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
