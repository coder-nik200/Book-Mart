import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookAPI, wishlistAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import { Globe, PackageCheck, TagIcon, ShoppingCart, Heart, ArrowLeft, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import FullMenu from "../pages/FullMenu";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await bookAPI.getBook(id);
        setBook(res.data.book);
        const wishlistRes = await wishlistAPI.isInWishlist(id);
        setInWishlist(wishlistRes.data.isInWishlist);
      } catch (err) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleWishlist = async () => {
    if (!book) return;
    try {
      setWishlistLoading(true);
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(book._id);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.addToWishlist({ bookId: book._id });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">📚</p>
        <p className="text-red-500 text-lg font-semibold">Book not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    );
  }

  const discount = book.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : null;

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : i < rating
              ? "text-yellow-400 fill-yellow-200"
              : "text-gray-300"
        }
      />
    ));

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Back button ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to books
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

          {/* ── Left: Cover image ── */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md">
              {/* Discount badge */}
              {discount && (
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {discount}% OFF
                </div>
              )}
              <img
                src={
                  book.image?.url
                    ? `http://localhost:5000${book.image.url}`
                    : "https://via.placeholder.com/400x500?text=Book"
                }
                alt={book.title}
                className="w-full rounded-2xl sm:rounded-3xl shadow-2xl object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {book.isFeatured && (
                <span className="bg-purple-100 text-purple-700 px-3 py-0.5 text-xs rounded-full font-semibold">
                  ✦ Featured
                </span>
              )}
              {book.isBestSeller && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-0.5 text-xs rounded-full font-semibold">
                  🏆 Bestseller
                </span>
              )}
              {book.isNewArrival && (
                <span className="bg-green-100 text-green-700 px-3 py-0.5 text-xs rounded-full font-semibold">
                  🆕 New Arrival
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {book.title}
            </h1>

            {/* Author */}
            <p className="text-sm sm:text-base text-gray-500">
              by{" "}
              <span className="font-semibold text-gray-800">{book.author}</span>
            </p>

            {/* Stars + review count */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">{renderStars(book.rating)}</div>
              <span className="text-sm font-semibold text-gray-700">
                {book.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-xs text-gray-400">
                ({book.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                ₹{book.discountPrice || book.price}
              </span>
              {book.discountPrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ₹{book.price}
                </span>
              )}
              {discount && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed border-l-4 border-blue-500 pl-4 italic bg-blue-50/50 py-2 pr-3 rounded-r-lg">
              {book.description}
            </p>

            {/* Meta card */}
            <div className="relative bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md overflow-hidden">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="space-y-4 mt-1">
                {/* Language */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Globe size={16} className="text-blue-500 shrink-0" />
                    <span>Language</span>
                  </div>
                  <span className="text-gray-800 font-semibold bg-gray-100 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
                    {book.language}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Category */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <TagIcon size={16} className="text-purple-500 shrink-0" />
                    <span>Category</span>
                  </div>
                  <span className="text-blue-700 bg-blue-100 font-semibold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
                    {book.category?.name}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Availability */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <PackageCheck size={16} className="text-green-500 shrink-0" />
                    <span>Availability</span>
                  </div>
                  {book.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 font-semibold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {book.stock} In Stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 font-semibold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col xs:flex-row gap-3 pt-1">
              <button
                disabled={book.stock === 0}
                onClick={() => addToCart(book._id, 1)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${book.stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg hover:shadow-blue-200 hover:shadow-xl"
                  }`}
              >
                <ShoppingCart size={18} />
                {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95 ${inWishlist
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500"
                  }`}
              >
                <Heart
                  size={18}
                  className={inWishlist ? "fill-white" : ""}
                />
                <span className="whitespace-nowrap">
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Related / Full Menu ── */}
        <div className="mt-12 sm:mt-16">
          <FullMenu />
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;