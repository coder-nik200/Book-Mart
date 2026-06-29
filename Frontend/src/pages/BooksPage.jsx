import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { bookAPI } from "../api/apiClient";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const BooksPage = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Init directly from URL — no sync effect needed, prevents input resets
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(() => searchParams.get("sort") || "");

  // Debounce search input — only debouncedSearch triggers API/URL updates
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync filters → URL using replace:true so typing doesn't spam history
  useEffect(() => {
    setSearchParams(
      {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(sort && { sort }),
        page: page.toString(),
      },
      { replace: true }
    );
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await bookAPI.getCategories();
        setCategories(res.data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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
      } catch {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  const handleAddToCart = (book) => {
    addToCart(book, 1);
    toast.success("Added to cart!");
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setPage(1);
    setFilterOpen(false);
  };

  const activeFilterCount = [
    search,
    selectedCategory,
    maxPrice,
    sort,
  ].filter(Boolean).length;

  // Shared filter panel content — used in both sidebar and drawer
  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Title or author..."
          className="mt-2 w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="mt-2 w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Max Price
        </label>
        <div className="mt-3 space-y-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={maxPrice || 5000}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>₹0</span>
            <span className="text-blue-600 font-semibold">₹{maxPrice || 5000}</span>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="mt-2 w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
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
        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition text-gray-700"
      >
        Clear Filters
      </button>
    </div>
  );

  if (loading && books.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Mobile filter drawer backdrop ── */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* ── Mobile filter drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-xs bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${filterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-base">Filters</span>
          <button
            onClick={() => setFilterOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <FilterPanel />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* ── Page header ── */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Explore Books
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
            Discover your next favorite read
          </p>
        </div>

        {/* ── Mobile: filter toggle + sort bar ── */}
        <div className="flex items-center gap-3 mb-5 md:hidden">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition"
          >
            <SlidersHorizontal size={16} className="text-blue-600" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Inline sort on mobile */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>

        {/* ── Main layout: sidebar + books ── */}
        <div className="grid md:grid-cols-4 gap-6 lg:gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Books grid */}
          <div className="md:col-span-3">
            {loading ? (
              <Loading />
            ) : books.length > 0 ? (
              <>
                {/* Results count */}
                <p className="text-xs sm:text-sm text-gray-400 mb-4 font-medium">
                  Showing {books.length} book{books.length !== 1 ? "s" : ""}
                  {activeFilterCount > 0 && " for current filters"}
                </p>

                {/* Grid — 2 cols on mobile, 3 on lg */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 mb-10">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Prev */}
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border bg-white text-sm font-medium hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={15} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Page numbers — collapsed on mobile */}
                    {Array.from({ length: totalPages }, (_, i) => {
                      const p = i + 1;
                      // On mobile show: first, last, current ±1
                      const show =
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - page) <= 1;
                      const showEllipsisBefore =
                        p === page - 2 && page - 2 > 1;
                      const showEllipsisAfter =
                        p === page + 2 && page + 2 < totalPages;

                      if (!show && !showEllipsisBefore && !showEllipsisAfter)
                        return null;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span
                            key={`ellipsis-${i}`}
                            className="px-1 text-gray-400 text-sm"
                          >
                            …
                          </span>
                        );
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${page === p
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            : "bg-white border hover:shadow-md text-gray-700"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    {/* Next */}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border bg-white text-sm font-medium hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg text-center px-6">
                <p className="text-5xl sm:text-6xl mb-4">📚</p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  No Books Found
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-xs">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition"
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