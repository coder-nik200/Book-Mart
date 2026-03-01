import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/books"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-extrabold text-gray-900 mb-8 sm:mb-12 text-[clamp(1.5rem,4vw,2.5rem)]">
          Your Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          <div className="md:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const book = item.book;

              return (
                <div
                  key={book._id}
                  className="bg-white/80 backdrop-blur-md border border-gray-200
                rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl
                transition-all duration-300 flex items-center gap-4 sm:gap-6"
                >
                 
                  <img
                    src={
                      book.image?.url
                        ? `http://localhost:5000${book.image.url}`
                        : "https://via.placeholder.com/400x500?text=Book"
                    }
                    alt={book.title}
                    className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-2xl shadow-md flex-shrink-0"
                  />

                
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {book.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-2 truncate">
                      {book.author}
                    </p>

                    <p className="text-lg sm:text-2xl font-bold text-blue-600">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-between h-full">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(book._id, item.quantity - 1)
                        }
                        className="p-1 hover:text-blue-600"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(book._id, item.quantity + 1)
                        }
                        className="p-1 hover:text-blue-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeFromCart(book._id);
                        toast.success("Removed from cart");
                      }}
                      className="text-red-500 hover:text-red-700 mt-4"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="mt-4 text-red-600 font-medium hover:underline text-sm sm:text-base"
            >
              Clear Entire Cart
            </button>
          </div>

          <div
            className="bg-white/90 backdrop-blur-md border border-gray-200
          rounded-3xl p-6 sm:p-8 shadow-xl 
          md:sticky md:top-24 h-fit"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 text-gray-700 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  ₹{cart.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>₹{(cart.totalPrice * 0.1).toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{(cart.totalPrice * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600
            text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg
            hover:scale-105 transition duration-300 shadow-lg"
            >
              Proceed to Checkout →
            </Link>

            <Link
              to="/books"
              className="block w-full text-center mt-4 border-2 border-blue-600
            text-blue-600 py-3 rounded-2xl font-semibold
            hover:bg-blue-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
