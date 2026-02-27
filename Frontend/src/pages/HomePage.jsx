import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { bookAPI } from "../api/apiClient";

import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import BookSection from "../components/Home/BookSection";
import FeaturesSection from "../components/Home/FeaturesSection";

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
      <HeroSection />
      <CategorySection />

      <BookSection
        title="Featured Books"
        link="/books"
        books={featuredBooks}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      <BookSection
        title="New Arrivals"
        link="/books?sort=newest"
        books={newArrivals}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        bg="bg-gray-50"
      />

      <BookSection
        title="Best Sellers"
        link="/books?sort=popularity"
        books={bestSellers}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      <FeaturesSection />
    </div>
  );
};

export default HomePage;
