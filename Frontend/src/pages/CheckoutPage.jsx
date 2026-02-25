import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { userAPI, orderAPI } from "../api/apiClient";
import toast from "react-hot-toast";
import { MapPin, Package, CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await userAPI.getAddresses();
        setAddresses(response.data.addresses);
      } catch (error) {
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
      const response = await orderAPI.createOrder({
        addressId: selectedAddress,
        paymentMethod,
      });

      const { order } = response.data;
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order/${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold">Delivery Address</h2>
              </div>

              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label key={address._id} className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold">{address.fullName}</p>
                        <p className="text-gray-600 text-sm">
                          {address.street}, {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-600 text-sm">{address.phoneNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No addresses found. Please add one.</p>
              )}

              <Link to="/profile" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                + Add New Address
              </Link>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { value: "credit_card", label: "Credit Card", icon: "💳" },
                  { value: "debit_card", label: "Debit Card", icon: "🏧" },
                  { value: "upi", label: "UPI", icon: "📱" },
                  { value: "net_banking", label: "Net Banking", icon: "🏦" },
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </div>

              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-6">Price Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="w-full block text-center mt-3 border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
