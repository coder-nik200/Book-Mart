import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 text-white">

      {/* Decorative Gradient Blur Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
          Discover Your Next{" "}
          <span className="text-yellow-400 drop-shadow-lg">
            Favorite Book
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          Explore thousands of books across every genre. From bestsellers to
          hidden gems — your perfect read is waiting.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <Link
            to="/books"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Shop Now
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </Link>

          <Link
            to="/about"
            className="px-8 py-4 border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;