import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-black text-white px-4">
      <div className="text-center max-w-xl">
        {/* 404 Number */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-yellow-400 drop-shadow-lg">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-300 mb-8 leading-relaxed">
          The page you are looking for might have been removed, renamed, or is
          temporarily unavailable.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 hover:bg-yellow-300 transition duration-300"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
