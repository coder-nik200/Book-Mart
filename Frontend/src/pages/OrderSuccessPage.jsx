import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = ({ orderId }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md">
        <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-700 mb-6">
          <span className="font-semibold">Order ID:</span> {orderId}
        </p>

        <Link
          to="/"
          className="inline-block w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>

        <Link
          to={`/order/${orderId}`}
          className="inline-block w-full mt-4 text-center text-blue-600 font-medium hover:underline"
        >
          View Order Details
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
