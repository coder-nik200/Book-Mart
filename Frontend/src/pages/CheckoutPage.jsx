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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-12 text-center sm:text-left">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Section */}
            <SectionCard icon={<MapPin />} title="Delivery Address">
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex gap-4 p-5 rounded-xl border transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                        selectedAddress === address._id
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
                        className="mt-1 accent-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {address.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.city}, {address.state}{" "}
                          {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.phoneNumber}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No addresses found.</p>
              )}
              <Link
                to="/profile/addresses"
                className="inline-block mt-4 text-blue-600 font-medium hover:underline"
              >
                + Add New Address
              </Link>
            </SectionCard>

            {/* Payment Section */}
            <SectionCard icon={<CreditCard />} title="Payment Method">
              <div className="space-y-4">
                {[
                  { value: "credit_card", label: "Credit Card" },
                  { value: "debit_card", label: "Debit Card" },
                  { value: "upi", label: "UPI" },
                  { value: "net_banking", label: "Net Banking" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition hover:border-blue-400 hover:bg-blue-50 ${
                      paymentMethod === method.value
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
                      className="accent-blue-600"
                    />
                    <span className="font-medium text-gray-800">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* Order Summary Section */}
            <SectionCard icon={<Package />} title="Order Items">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₹
                    {(item.discountPrice || item.price * item.quantity).toFixed(
                      2,
                    )}
                  </p>
                </div>
              ))}
            </SectionCard>
          </div>

          {/* RIGHT SIDE - PRICE BOX */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Price Details
            </h2>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
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

              <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="block text-center mt-4 text-blue-600 font-medium hover:underline"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Card
const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
    <div className="flex items-center gap-3 mb-6">
      <div className="text-blue-600">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

export default CheckoutPage;
