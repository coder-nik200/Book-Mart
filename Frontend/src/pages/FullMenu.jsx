import React, { useEffect, useState } from "react";
import { bookAPI, wishlistAPI } from "../api/apiClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaBookOpen } from "react-icons/fa";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

const FullMenu = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);

      const res = await bookAPI.getAllBooks({
        page,
        limit: 12,
      });

      const booksData = res.data.books || [];
      setBooks(booksData);
      setTotalPages(res.data.pagination.pages);
      setCurrentPage(res.data.pagination.page);

      const wishlistStatus = {};
      for (let book of booksData) {
        try {
          const wishlistRes = await wishlistAPI.isInWishlist(book._id);
          wishlistStatus[book._id] = wishlistRes.data.isInWishlist;
        } catch {
          wishlistStatus[book._id] = false;
        }
      }

      setWishlistMap(wishlistStatus);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async (bookId) => {
    try {
      setWishlistLoading(true);

      if (wishlistMap[bookId]) {
        await wishlistAPI.removeFromWishlist(bookId);
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.addToWishlist({ bookId });
        toast.success("Added to wishlist");
      }

      setWishlistMap((prev) => ({
        ...prev,
        [bookId]: !prev[bookId],
      }));
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen mt-10">

      <section className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-white py-20 rounded-3xl shadow-xl">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Explore Our Full Collection
          </motion.h1>
          <p className="opacity-90">
            Discover your next favorite read from our complete catalog.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <FaBookOpen className="mx-auto text-6xl text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700">
                No Books Available
              </h2>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {books.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" }); 
                      navigate(`/book/${book._id}`); 
                    }}
                  >
                    <img
                      src={`http://localhost:5000${book.image?.url}`}
                      alt={book.title}
                      className="w-full h-72 object-cover"
                    />

                    <div className="p-5 flex flex-col justify-between h-[260px]">
                      <div>
                        <Link
                          to={`/book/${book._id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {book.title}
                          </h3>
                        </Link>

                        <p className="text-gray-500 text-sm mt-1 mb-3">
                          {book.author}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const rating = book.rating || 0;
                              if (i < Math.floor(rating))
                                return <FaStar key={i} size={16} />;
                              else if (i < rating)
                                return <FaStarHalfAlt key={i} size={16} />;
                              else return <FaRegStar key={i} size={16} />;
                            })}
                          </div>

                          <span className="text-sm text-gray-600">
                            {book.rating ? book.rating.toFixed(1) : "0.0"}
                          </span>
                        </div>

                   
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{book.discountPrice || book.price}
                          </span>

                          {book.discountPrice && (
                            <span className="line-through text-gray-400 text-sm">
                              ₹{book.price}
                            </span>
                          )}
                        </div>

                        <div>
                          {book.stock > 0 ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                     
                      <div className="flex gap-3 mt-5">
                        <button
                          disabled={book.stock === 0}
                          onClick={() => addToCart(book._id, 1)}
                          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300"
                        >
                          <ShoppingCart size={18} />
                          Add
                        </button>

                        <button
                          onClick={() => handleWishlist(book._id)}
                          disabled={wishlistLoading}
                          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
                        >
                          <Heart
                            size={18}
                            className={`transition duration-300 ${
                              wishlistMap[book._id]
                                ? "text-red-500 fill-red-500 scale-110"
                                : "text-gray-500 hover:text-red-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center items-center mt-16 gap-4 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2 rounded-full bg-white shadow-md disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-5 py-2 rounded-full shadow-md transition ${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white scale-105"
                        : "bg-white hover:bg-indigo-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-5 py-2 rounded-full bg-white shadow-md disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FullMenu;
