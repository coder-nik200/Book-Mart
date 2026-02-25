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

        setFeaturedBooks(featured.data.books);
        setNewArrivals(newArr.data.books);
        setBestSellers(best.data.books);
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

  const handleAddToWishlist = (book) => {
    toast.success("Added to wishlist!");
  };

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to BookMart</h1>
          <p className="text-xl mb-8">Discover your next favorite book from our huge collection</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/books"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <button className="px-8 py-3 border-2 border-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {["Fiction", "Science", "History", "Self-Help"].map((cat) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                className="p-6 bg-white rounded-lg text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-2">📚</div>
                <h3 className="font-bold">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Link to="/books" className="flex items-center gap-2 text-blue-600 hover:gap-4 transition">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
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

      {/* New Arrivals */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link to="/books?sort=newest" className="flex items-center gap-2 text-blue-600 hover:gap-4 transition">
              View All <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
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

      {/* Best Sellers */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <Link to="/books?sort=popularity" className="flex items-center gap-2 text-blue-600 hover:gap-4 transition">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
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

      {/* Features Section */}
      <div className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
