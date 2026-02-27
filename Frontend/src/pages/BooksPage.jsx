import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { bookAPI } from "../api/apiClient";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const BooksPage = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  /* ----------------------------
     Initialize Filters From URL
  ---------------------------- */
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, []);

  /* ----------------------------
     Debounce Search
  ---------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ----------------------------
     Update URL When Filters Change
  ---------------------------- */
  useEffect(() => {
    setSearchParams({
      search: debouncedSearch || "",
      category: selectedCategory || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      sort: sort || "",
      page: page.toString(),
    });
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  /* ----------------------------
     Fetch Categories
  ---------------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await bookAPI.getCategories();
        setCategories(res.data.categories);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  /* ----------------------------
     Fetch Books
  ---------------------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const res = await bookAPI.getAllBooks({
          search: debouncedSearch,
          category: selectedCategory,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          limit: 12,
        });

        setBooks(res.data.books);
        setTotalPages(res.data.pagination.pages);
      } catch (err) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  /* ----------------------------
     Handlers
  ---------------------------- */
  const handleAddToCart = (book) => {
    addToCart(book, 1);
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = () => {
    toast.success("Added to wishlist!");
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setPage(1);
  };

  /* ----------------------------
     Render
  ---------------------------- */

  if (loading && books.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Explore Books
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Discover your next favorite read
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-10">
          {/* ================= FILTER SIDEBAR ================= */}
          <div className="md:col-span-1">
            <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6 sticky top-24">
              <h2 className="text-xl font-bold mb-2">Filters</h2>

              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by title or author"
                  className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Price Range
                </label>

                <div className="mt-4 space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full accent-blue-600"
                  />

                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>₹0</span>
                    <span>₹{maxPrice || 5000}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Newest</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* ================= BOOK GRID ================= */}
          <div className="md:col-span-3">
            {loading ? (
              <Loading />
            ) : books.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>

                {/* Premium Pagination */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2 rounded-xl border bg-white hover:shadow-md transition disabled:opacity-40"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-xl transition ${
                        page === i + 1
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "bg-white border hover:shadow-md"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2 rounded-xl border bg-white hover:shadow-md transition disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                <div className="text-7xl mb-4">📚</div>
                <h2 className="text-3xl font-bold mb-2">No Books Found</h2>
                <p className="text-gray-500 mb-6">
                  Try changing filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
