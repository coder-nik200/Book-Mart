import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, SearchX, Search } from "lucide-react";
import { motion } from "framer-motion";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/books/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
    else setLoading(false);
  }, [query]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">
          Searching for "{query}"...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-5 sm:mb-7"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Search size={18} className="text-blue-600 shrink-0" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Results for{" "}
              <span className="text-blue-600">"{query}"</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 ml-7">
            {books.length} book{books.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ── No results ── */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white rounded-2xl shadow-sm border border-gray-100 text-center px-6">
            <SearchX size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              No books found
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              We couldn't find anything for "{query}". Try a different title or author name.
            </p>
            <button
              onClick={() => navigate("/books")}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              Browse all books
            </button>
          </div>

        ) : (
          /* ── Results grid — 2 cols mobile, 3 sm, 4 md+ ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {books.map((book, index) => {
              const discount = book.discountPrice
                ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
                : null;

              return (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  {/* Cover */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={
                        book.image?.url
                          ? `http://localhost:5000${book.image.url}`
                          : "https://via.placeholder.com/200x260?text=Book"
                      }
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount badge */}
                    {discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {book.title}
                    </h3>

                    {book.author && (
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-1 line-clamp-1">
                        {book.author}
                      </p>
                    )}

                    {/* Price row */}
                    <div className="flex items-baseline gap-1.5 mt-auto pt-2">
                      <span className="text-sm sm:text-base font-bold text-blue-600">
                        ₹{book.discountPrice || book.price}
                      </span>
                      {book.discountPrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
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
                        <span className="text-[10px] sm:text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;