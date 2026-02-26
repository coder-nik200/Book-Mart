import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookAPI } from "../api/apiClient";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const [featured, newArr, best] = await Promise.all([
          bookAPI.getFeaturedBooks(),
          bookAPI.getNewArrivals(),
          bookAPI.getBestSellers(),
        ]);

        setFeaturedBooks(featured.data.books || []);
        setNewArrivals(newArr.data.books || []);
        setBestSellers(best.data.books || []);
      } catch (error) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book, 1);
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = () => {
    toast.success("Added to wishlist!");
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover Your Next{" "}
            <span className="text-yellow-400">Favorite Book</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Explore thousands of books across all genres. Find bestsellers, new
            arrivals, and hidden gems curated just for you.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              to="/books"
              className="px-10 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-yellow-300 transition duration-300"
            >
              Shop Now
            </Link>

            <button className="px-10 py-4 border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Browse by Category
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {["Fiction", "Science", "History", "Self-Help"].map((cat) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                className="group p-8 bg-white rounded-2xl text-center shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">
                  📚
                </div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition">
                  {cat}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FEATURED BOOKS ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight">Featured Books</h2>

          <Link
            to="/books"
            className="flex items-center gap-2 text-blue-600 font-medium hover:gap-4 hover:text-blue-800 transition-all duration-300"
          >
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {featuredBooks.slice(0, 4).map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>

      {/* ================= NEW ARRIVALS ================= */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight">New Arrivals</h2>

            <Link
              to="/books?sort=newest"
              className="flex items-center gap-2 text-blue-600 font-medium hover:gap-4 hover:text-blue-800 transition-all duration-300"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
            {newArrivals.slice(0, 4).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= BEST SELLERS ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight">Best Sellers</h2>

          <Link
            to="/books?sort=popularity"
            className="flex items-center gap-2 text-blue-600 font-medium hover:gap-4 hover:text-blue-800 transition-all duration-300"
          >
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {bestSellers.slice(0, 4).map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition duration-300">
              <div className="text-5xl mb-6">🚚</div>
              <h3 className="text-2xl font-bold mb-3">Free Shipping</h3>
              <p className="text-gray-300">On orders above $50 worldwide</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition duration-300">
              <div className="text-5xl mb-6">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-300">100% safe & encrypted checkout</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition duration-300">
              <div className="text-5xl mb-6">↩️</div>
              <h3 className="text-2xl font-bold mb-3">Easy Returns</h3>
              <p className="text-gray-300">30-day hassle free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
