import React, { useEffect, useState } from "react";
import { bookAPI, wishlistAPI } from "../api/apiClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaBookOpen } from "react-icons/fa";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";

const FullMenu = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      const res = await bookAPI.getAllBooks({ page, limit: 12 });
      const booksData = res.data.books || [];
      setBooks(booksData);
      setTotalPages(res.data.pagination.pages);
      setCurrentPage(res.data.pagination.page);

      // Check wishlist status per book
      const wishlistStatus = {};
      await Promise.all(
        booksData.map(async (book) => {
          try {
            const r = await wishlistAPI.isInWishlist(book._id);
            wishlistStatus[book._id] = r.data.isInWishlist;
          } catch {
            wishlistStatus[book._id] = false;
          }
        })
      );
      setWishlistMap(wishlistStatus);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async (e, bookId) => {
    e.stopPropagation();
    try {
      setWishlistLoading((prev) => ({ ...prev, [bookId]: true }));
      if (wishlistMap[bookId]) {
        await wishlistAPI.removeFromWishlist(bookId);
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.addToWishlist({ bookId });
        toast.success("Added to wishlist");
      }
      setWishlistMap((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
    } catch {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const handleAddToCart = (e, book) => {
    e.stopPropagation();
    addToCart(book._id, 1);
    toast.success("Added to cart!");
  };

  useEffect(() => {
    fetchBooks(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }).map((_, i) => {
      if (i < Math.floor(rating)) return <FaStar key={i} size={11} className="sm:text-sm" />;
      if (i < rating) return <FaStarHalfAlt key={i} size={11} className="sm:text-sm" />;
      return <FaRegStar key={i} size={11} className="sm:text-sm" />;
    });

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen mt-8 sm:mt-10">

      {/* ── Hero banner ── */}
      <section className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-white py-12 sm:py-16 md:py-20 rounded-2xl sm:rounded-3xl shadow-xl mx-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight"
          >
            Explore Our Full Collection
          </motion.h1>
          <p className="opacity-90 text-sm sm:text-base max-w-xl mx-auto px-4">
            Discover your next favorite read from our complete catalog.
          </p>
        </div>
      </section>

      {/* ── Books section ── */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-600 border-t-transparent" />
            </div>

          ) : books.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg px-4">
              <FaBookOpen className="mx-auto text-5xl sm:text-6xl text-gray-300 mb-4 sm:mb-6" />
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-700">
                No Books Available
              </h2>
            </div>

          ) : (
            <>
              {/* ── Book grid — 2 cols mobile, 3 md, 4 lg ── */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:grid-gap-6 lg:gap-8">
                {books.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/book/${book._id}`);
                    }}
                  >
                    {/* Cover image — aspect-ratio driven */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={`http://localhost:5000${book.image?.url}`}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Discount badge */}
                      {book.discountPrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
                        </div>
                      )}

                      {/* Wishlist overlay button */}
                      <button
                        onClick={(e) => handleWishlist(e, book._id)}
                        disabled={wishlistLoading[book._id]}
                        aria-label="Toggle wishlist"
                        className="absolute top-2 left-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform duration-200"
                      >
                        <Heart
                          size={13}
                          className={`sm:w-[15px] sm:h-[15px] transition duration-300 ${wishlistMap[book._id]
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-grow p-3 sm:p-4">

                      {/* Title */}
                      <Link
                        to={`/book/${book._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                      </Link>

                      {/* Author */}
                      <p className="text-gray-400 text-[11px] sm:text-xs mt-1 line-clamp-1">
                        {book.author}
                      </p>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mt-2 text-yellow-400">
                        {renderStars(book.rating)}
                        <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5">
                          {book.rating ? book.rating.toFixed(1) : "0.0"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          ₹{book.discountPrice || book.price}
                        </span>
                        {book.discountPrice && (
                          <span className="line-through text-gray-400 text-[10px] sm:text-xs">
                            ₹{book.price}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="mt-1.5">
                        {book.stock > 0 ? (
                          <span className="text-[10px] sm:text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Add to cart — pinned to bottom */}
                      <button
                        disabled={book.stock === 0}
                        onClick={(e) => handleAddToCart(e, book)}
                        className="mt-auto pt-3 w-full flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={13} className="sm:w-4 sm:h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-10 sm:mt-14 gap-1.5 sm:gap-2 flex-wrap">

                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl bg-white shadow-sm text-sm font-medium disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition"
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1;
                    const show =
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1;
                    const ellipsisBefore = p === currentPage - 2 && currentPage - 2 > 1;
                    const ellipsisAfter = p === currentPage + 2 && currentPage + 2 < totalPages;

                    if (!show && !ellipsisBefore && !ellipsisAfter) return null;

                    if (ellipsisBefore || ellipsisAfter) {
                      return (
                        <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">
                          …
                        </span>
                      );
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold shadow-sm transition ${currentPage === p
                            ? "bg-indigo-600 text-white scale-105"
                            : "bg-white hover:bg-indigo-50 text-gray-700"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl bg-white shadow-sm text-sm font-medium disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FullMenu;