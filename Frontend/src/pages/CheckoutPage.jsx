import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { userAPI, orderAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import { MapPin, Package, CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await userAPI.getAddresses();
        setAddresses(res.data.addresses || []);
      } catch {
        toast.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);
    try {
      const addressObj = addresses.find((a) => a._id === selectedAddress);
      const orderData = {
        items: cart.items.map((item) => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: addressObj.fullName,
          street: addressObj.street,
          city: addressObj.city,
          state: addressObj.state,
          zipCode: addressObj.zipCode,
          phoneNumber: addressObj.phoneNumber,
          country: addressObj.country || "India",
        },
        paymentMethod,
        totalPrice: cart.totalPrice,
      };

      const response = await orderAPI.createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-success", {
        state: { orderId: response.data.order._id },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 sm:mb-8 md:mb-12 text-center sm:text-left">
          Secure Checkout
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-8 lg:gap-10">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-8">

            {/* Delivery Address */}
            <SectionCard icon={<MapPin />} title="Delivery Address">
              {addresses.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl border transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${selectedAddress === address._id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200"
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 accent-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {address.fullName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {address.street}, {address.city}, {address.state}{" "}
                          {address.zipCode}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {address.phoneNumber}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No addresses found.</p>
              )}
              <Link
                to="/profile/addresses"
                className="inline-block mt-3 sm:mt-4 text-blue-600 font-medium hover:underline text-sm sm:text-base"
              >
                + Add New Address
              </Link>
            </SectionCard>

            {/* Payment Method */}
            <SectionCard icon={<CreditCard />} title="Payment Method">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: "credit_card", label: "Credit Card" },
                  { value: "debit_card", label: "Debit Card" },
                  { value: "upi", label: "UPI" },
                  { value: "net_banking", label: "Net Banking" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border cursor-pointer transition hover:border-blue-400 hover:bg-blue-50 ${paymentMethod === method.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-600 flex-shrink-0"
                    />
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* Order Items */}
            <SectionCard icon={<Package />} title="Order Items">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-200 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base flex-shrink-0">
                    ₹{(item.discountPrice || item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </SectionCard>
          </div>

          {/* ── Price Summary ── */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
              Price Details
            </h2>

            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="block text-center mt-3 sm:mt-4 text-blue-600 font-medium hover:underline text-sm sm:text-base"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 hover:shadow-lg transition">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="text-blue-600">{icon}</div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

export default CheckoutPage;