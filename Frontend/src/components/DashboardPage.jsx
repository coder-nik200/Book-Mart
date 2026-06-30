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
import { Loader2 } from "lucide-react";
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
      <div className="flex justify-center items-center h-screen bg-[#121212]">
        <Loader2 size={36} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#121212] min-h-screen font-['DM_Sans',sans-serif] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-white/55 text-sm sm:text-base">
          Here's a quick overview of your account.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-5 sm:p-6 flex items-center gap-4 cursor-pointer transition hover:border-amber-400/30 hover:bg-white/[0.07]"
          onClick={() => navigate("/cart")}
        >
          <div className="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
            <FaShoppingCart size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-white/55 text-sm">Cart Items</p>
            <p className="text-2xl font-bold text-white">{cartItems.totalItems || 0}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-5 sm:p-6 flex items-center gap-4 cursor-pointer transition hover:border-red-400/30 hover:bg-white/[0.07]"
          onClick={() => navigate("/wishlist")}
        >
          <div className="w-12 h-12 rounded-full bg-red-400/15 border border-red-400/30 flex items-center justify-center shrink-0">
            <FaHeart size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-white/55 text-sm">Wishlist Items</p>
            <p className="text-2xl font-bold text-white">{wishlistItems.length}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-5 sm:p-6 flex items-center gap-4 cursor-pointer transition hover:border-blue-400/30 hover:bg-white/[0.07]"
          onClick={() => navigate("/orders")}
        >
          <div className="w-12 h-12 rounded-full bg-blue-400/15 border border-blue-400/30 flex items-center justify-center shrink-0">
            <FaBook size={20} className="text-blue-300" />
          </div>
          <div>
            <p className="text-white/55 text-sm">Recent Orders</p>
            <p className="text-2xl font-bold text-white">{recentOrders.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 mb-8">
        <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 border-b border-white/10 pb-3">
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-white/55 py-4 text-center">
            You haven't purchased any books yet.
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {recentOrders.map((order, index) => (
              <li
                key={order._id || index}
                className="p-4 border border-white/10 bg-white/[0.02] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.18] transition cursor-pointer flex flex-col gap-2"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <p className="font-['Cormorant_Garamond',serif] text-white font-bold text-base sm:text-lg">
                  {order.items[0]?.book?.title || "Unknown Book"}
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4 text-white/55 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-amber-400" size={13} />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FaBoxes className="text-emerald-400" size={13} />
                    <span>{order.items.length} items</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FaRupeeSign className="text-amber-400" size={13} />
                    <span>{order.totalPrice}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Wishlist Preview */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 mb-8">
        <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 border-b border-white/10 pb-3">
          Wishlist Preview
        </h2>

        {wishlistItems.length === 0 ? (
          <p className="text-white/55 py-4 text-center">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {wishlistItems.slice(0, 8).map((book, idx) => (
              <motion.div
                key={book._id || book.id || idx}
                className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden cursor-pointer transition hover:border-amber-400/30 hover:bg-white/[0.07]"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/wishlist");
                }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`http://localhost:5000${book.image?.url}`}
                  alt={book.title}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                />
                <div className="p-2.5 sm:p-3 text-center">
                  <p className="text-xs sm:text-sm font-medium truncate text-white">
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="text-xs text-white/50 mt-1 truncate">
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