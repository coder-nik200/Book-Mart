import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { wishlistAPI } from "../api/apiClient";
import toast from "react-hot-toast";

const BookCard = ({ book, onAddToCart }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await wishlistAPI.isInWishlist(book._id);
        setInWishlist(res.data.isInWishlist);
      } catch (error) {
        console.error("Wishlist check failed", error);
      }
    };

    if (book?._id) checkWishlist();
  }, [book?._id]);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
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
      console.error(error);
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(book);
  };

  const discount =
    book.discountPrice
      ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
      : null;

  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* ── Cover image — aspect-ratio driven, no fixed height ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={
            book.image?.url
              ? `http://localhost:5000${book.image.url}`
              : "https://via.placeholder.com/300x400?text=Book"
          }
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold shadow">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist button — overlaid top-left */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 left-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform duration-200"
        >
          <Heart
            size={14}
            className={`transition duration-300 sm:w-4 sm:h-4 ${inWishlist
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-400"
              }`}
          />
        </button>
      </div>

      {/* ── Card body — flex-grow so all cards align at bottom ── */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-5">

        {/* Title */}
        <Link
          to={`/book/${book._id}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-blue-600 transition-colors"
        >
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-1 leading-snug">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1">
          {book.author}
        </p>

        {/* Stars — hidden on very small, shown from xs up */}
        <div className="flex items-center gap-1 sm:gap-2 mt-2">
          <div className="flex text-yellow-400 gap-px">
            {Array.from({ length: 5 }).map((_, i) => {
              const rating = book.rating || 0;
              if (i < Math.floor(rating))
                return <FaStar key={i} size={11} className="sm:w-3.5 sm:h-3.5" />;
              if (i < rating)
                return <FaStarHalfAlt key={i} size={11} className="sm:w-3.5 sm:h-3.5" />;
              return <FaRegStar key={i} size={11} className="sm:w-3.5 sm:h-3.5" />;
            })}
          </div>
          <span className="text-xs font-medium text-gray-600 leading-none">
            {book.rating ? book.rating.toFixed(1) : "0.0"}
          </span>
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            ({book.totalReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            ₹{book.discountPrice || book.price}
          </span>
          {book.discountPrice && (
            <span className="line-through text-gray-400 text-xs sm:text-sm">
              ₹{book.price}
            </span>
          )}
        </div>

        {/* Stock badge */}
        <div className="mt-2">
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
          onClick={handleAddToCart}
          disabled={book.stock === 0}
          className="mt-auto pt-3 w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;