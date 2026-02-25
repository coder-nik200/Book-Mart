import React from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const BookCard = ({ book, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link to={`/book/${book._id}`} className="block relative h-64 overflow-hidden bg-gray-200">
        <img
          src={book.image?.url || "https://via.placeholder.com/300x400?text=Book"}
          alt={book.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        {book.discountPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
            -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/book/${book._id}`} className="hover:text-blue-600 transition">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({book.totalReviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">${book.discountPrice || book.price}</span>
          {book.discountPrice && <span className="line-through text-gray-500">${book.price}</span>}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {book.stock > 0 ? (
            <span className="text-xs text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(book)}
            disabled={book.stock === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
          <button
            onClick={() => onAddToWishlist(book)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
