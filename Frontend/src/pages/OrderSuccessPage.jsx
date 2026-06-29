import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccessPage = ({ orderId }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 via-white to-gray-50 px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center w-full max-w-sm sm:max-w-md"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <div className="p-4 bg-green-50 rounded-full">
            <CheckCircle size={48} className="text-green-500 sm:w-16 sm:h-16" />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Your order has been placed successfully. We'll get it to you soon.
        </p>

        {/* Order ID pill */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 sm:mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
            Order ID
          </p>
          <p className="text-sm sm:text-base font-mono font-bold text-gray-800 break-all">
            {orderId}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md hover:shadow-green-200 hover:shadow-lg"
          >
            <ShoppingBag size={17} />
            Continue Shopping
          </Link>

          <Link
            to={`/order/${orderId}`}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm sm:text-base font-semibold border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all"
          >
            <ClipboardList size={17} />
            View Order Details
          </Link>
        </div>
      </motion.div>

      {/* Subtle footer note */}
      <p className="mt-6 text-xs text-gray-400 text-center px-4">
        A confirmation will be sent to your registered email address.
      </p>
    </div>
  );
};

export default OrderSuccessPage;