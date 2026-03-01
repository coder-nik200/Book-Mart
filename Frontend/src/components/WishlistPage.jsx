import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { wishlistAPI } from "../api/apiClient";
import { motion } from "framer-motion";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await wishlistAPI.removeFromWishlist(bookId);
      setWishlist((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
          >
            My Wishlist
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg opacity-90 max-w-2xl mx-auto"
          >
            Keep track of all the books you love and want to read next.
          </motion.p>
        </div>
      </section>

      {/* Wishlist Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20 bg-white rounded-xl shadow-md"
            >
              <FaRegHeart className="mx-auto text-6xl text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500">
                Browse our books and add your favorites to the wishlist.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {wishlist.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      src={`http://localhost:5000${book.image?.url}`}
                      alt={book.title}
                      className="w-full h-72 object-cover"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">{book.author}</p>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => removeFromWishlist(book.id)}
                      className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-full font-medium hover:bg-red-600 transition duration-300"
                    >
                      <FaHeart />
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
