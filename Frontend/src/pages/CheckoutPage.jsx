import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await userAPI.getAddresses();
        setAddresses(response.data.addresses || []);
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

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">Secure Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-10">
            {/* Address Section */}
            <SectionCard icon={<MapPin />} title="Delivery Address">
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex gap-4 p-5 rounded-xl border cursor-pointer transition ${
                        selectedAddress === address._id
                          ? "border-blue-600 bg-blue-50"
                          : "hover:bg-gray-50"
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
                      <div>
                        <p className="font-semibold">{address.fullName}</p>
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
                to="/profile"
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
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === method.value
                        ? "border-blue-600 bg-blue-50"
                        : "hover:bg-gray-50"
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
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* Order Summary */}
            <SectionCard icon={<Package />} title="Order Items">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-3 border-b"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    $
                    {(
                      (item.discountPrice || item.price) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </SectionCard>
          </div>

          {/* RIGHT SIDE - PRICE BOX */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6">Price Details</h2>

            <div className="space-y-3 mb-6 text-sm">
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
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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

/* Reusable Card Wrapper */
const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="text-blue-600">{icon}</div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

export default CheckoutPage;
