import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookAPI, wishlistAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import { Globe, PackageCheck, TagIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import FullMenu from "../pages/FullMenu";

const BookDetailsPage = () => {
  const { id } = useParams();
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
      console.error(error);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
        Loading book details...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-xl">
        Book not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-14">
        <div className="flex justify-center">
          <img
            src={
              book.image?.url
                ? `http://localhost:5000${book.image.url}`
                : "https://via.placeholder.com/400x500?text=Book"
            }
            alt={book.title}
            className="w-full max-w-md rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex gap-3 mb-4 flex-wrap">
            {book.isFeatured && (
              <span className="bg-purple-100 text-purple-700 px-4 py-1 text-xs rounded-full font-semibold">
                Featured
              </span>
            )}
            {book.isBestSeller && (
              <span className="bg-yellow-100 text-yellow-700 px-4 py-1 text-xs rounded-full font-semibold">
                Bestseller
              </span>
            )}
            {book.isNewArrival && (
              <span className="bg-green-100 text-green-700 px-4 py-1 text-xs rounded-full font-semibold">
                New Arrival
              </span>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            {book.title}
          </h1>

          <p className="text-lg text-gray-500 mb-4">
            by <span className="font-medium text-gray-800">{book.author}</span>
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-yellow-500 text-xl">
              {"★".repeat(Math.floor(book.rating))}
              {"☆".repeat(5 - Math.floor(book.rating))}
            </div>
            <span className="text-gray-500 text-sm">
              {book.rating} ({book.totalReviews} reviews)
            </span>
          </div>

          <div className="mb-6">
            {book.discountPrice ? (
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue-600">
                  ₹{book.discountPrice}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{book.price}
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-blue-600">
                ₹{book.price}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 border-l-4 border-blue-600 pl-4 italic">
            {book.description}
          </p>

          <div className="relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-7 mb-10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="space-y-6 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <Globe size={18} className="text-blue-500" />
                  <span>Language</span>
                </div>
                <span className="text-gray-900 font-semibold bg-gray-100 px-5 py-1.5 rounded-full text-sm tracking-wide">
                  {book.language}
                </span>
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <TagIcon size={18} className="text-purple-500" />
                  <span>Category</span>
                </div>
                <span className="text-blue-700 bg-blue-100 font-semibold px-5 py-1.5 rounded-full text-sm tracking-wide">
                  {book.category?.name}
                </span>
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <PackageCheck size={18} className="text-green-500" />
                  <span>Availability</span>
                </div>
                {book.stock > 0 ? (
                  <span className="relative bg-green-100 text-green-700 font-semibold px-5 py-1.5 rounded-full text-sm tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {book.stock} In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 font-semibold px-5 py-1.5 rounded-full text-sm tracking-wide">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              disabled={book.stock === 0}
              onClick={() => addToCart(book._id, 1)}
              className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition duration-300 ${
                book.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`px-6 py-4 rounded-2xl border font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                inWishlist
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {inWishlist ? "❤️ Remove Wishlist" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <FullMenu />
    </div>
  );
};

export default BookDetailsPage;
