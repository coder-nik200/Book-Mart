import React, { useState, useEffect } from "react";
import { bookAPI } from "../api/apiClient";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const { addToCart } = useCart();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookAPI.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookAPI.getAllBooks({
          search,
          category: selectedCategory,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          limit: 12,
        });

        setBooks(response.data.books);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, selectedCategory, minPrice, maxPrice, sort, page]);

  const handleAddToCart = (book) => {
    addToCart(book, 1);
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = (book) => {
    toast.success("Added to wishlist!");
  };

  if (loading && books.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Books</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6 sticky top-20">
              {/* Search */}
              <div>
                <label className="block font-bold mb-2">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Book title or author"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
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
                <label className="block font-bold mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Min"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Max"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block font-bold mb-2">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("");
                  setPage(1);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <Loading />
            ) : books.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        page === i + 1 ? "bg-blue-600 text-white" : "border hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No books found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
