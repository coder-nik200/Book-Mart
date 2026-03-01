import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import { bookAPI } from "../api/apiClient";


import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import BookSection from "../components/Home/BookSection";
import FeaturesSection from "../components/Home/FeaturesSection";

const HomePage = () => {
  const { addToCart } = useCart();

  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomePageBooks = useCallback(async () => {
    try {
      setLoading(true);

      const [featuredRes, newArrRes, bestRes] = await Promise.all([
        bookAPI.getFeaturedBooks(),
        bookAPI.getNewArrivals(),
        bookAPI.getBestSellers(),
      ]);

      setFeaturedBooks(featuredRes?.data?.books ?? []);
      setNewArrivals(newArrRes?.data?.books ?? []);
      setBestSellers(bestRes?.data?.books ?? []);
    } catch (error) {
      console.error("HomePage Fetch Error:", error);
      toast.error("Unable to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomePageBooks();
  }, [fetchHomePageBooks]);

 
  const handleAddToCart = useCallback(
    (book) => {
      addToCart(book, 1);
      toast.success("Book added to cart");
    },
    [addToCart],
  );

  if (loading) return <Loading />;

  return (
    <main className="bg-gray-50">
 
      <HeroSection />


      <CategorySection />

      <BookSection
        title="Featured Books"
        link="/books"
        books={featuredBooks}
        onAddToCart={handleAddToCart}
      />

      <BookSection
        title="New Arrivals"
        link="/books?sort=newest"
        books={newArrivals}
        onAddToCart={handleAddToCart}
        bg="bg-gray-100"
      />

  
      <BookSection
        title="Best Sellers"
        link="/books?sort=popularity"
        books={bestSellers}
        onAddToCart={handleAddToCart}
      />


      <FeaturesSection />
    </main>
  );
};

export default HomePage;
