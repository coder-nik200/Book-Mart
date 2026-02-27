import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white overflow-hidden flex items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 text-center w-full">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          Discover Your Next{" "}
          <span className="text-yellow-400">Favorite Book</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
          Explore thousands of books across all genres. Find bestsellers, new
          arrivals, and hidden gems curated just for you.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            to="/books"
            className="px-10 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-yellow-300 transition duration-300"
          >
            Shop Now
          </Link>

          <button className="px-10 py-4 border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
