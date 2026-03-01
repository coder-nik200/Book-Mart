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

  /* =============================
     Check If Book Is In Wishlist
  ============================= */
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await wishlistAPI.isInWishlist(book._id);
        setInWishlist(res.data.isInWishlist);
      } catch (error) {
        console.error("Wishlist check failed", error);
      }
    };

    if (book?._id) {
      checkWishlist();
    }
  }, [book?._id]);

  /* =============================
     Toggle Wishlist
  ============================= */
  const handleWishlistClick = async () => {
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

  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <Link className="block relative h-72 overflow-hidden bg-gray-100">
        <img
          src={
            book.image?.url
              ? `http://localhost:5000${book.image.url}`
              : "https://via.placeholder.com/300x400?text=Book"
          }
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {book.discountPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {Math.round(((book.price - book.discountPrice) / book.price) * 100)}
            % OFF
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between h-[260px]">
        <div>
          <Link
            to={`/book/${book._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {book.title}
            </h3>
          </Link>

          <p className="text-gray-500 text-sm mt-1 mb-3">{book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = book.rating || 0;

                if (i < Math.floor(rating)) {
                  return <FaStar key={i} size={16} />;
                } else if (i < rating) {
                  return <FaStarHalfAlt key={i} size={16} />;
                } else {
                  return <FaRegStar key={i} size={16} />;
                }
              })}
            </div>

            <span className="text-sm font-medium text-gray-700">
              {book.rating ? book.rating.toFixed(1) : "0.0"}
            </span>

            <span className="text-xs text-gray-500">
              ({book.totalReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl font-bold text-gray-900">
              ₹{book.discountPrice || book.price}
            </span>

            {book.discountPrice && (
              <span className="line-through text-gray-400 text-sm">
                ₹{book.price}
              </span>
            )}
          </div>

          {/* Stock */}
          <div>
            {book.stock > 0 ? (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onAddToCart(book)}
            disabled={book.stock === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            <ShoppingCart size={18} />
            Add
          </button>

          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
          >
            <Heart
              size={18}
              className={`transition duration-300 ${
                inWishlist
                  ? "text-red-500 fill-red-500 scale-110"
                  : "text-gray-500 hover:text-red-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
