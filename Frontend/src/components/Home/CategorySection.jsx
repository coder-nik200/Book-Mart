import { Link } from "react-router-dom";
import { BookOpen, Atom, Landmark, HeartHandshake } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    icon: BookOpen,
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Science",
    icon: Atom,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "History",
    icon: Landmark,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Self-Help",
    icon: HeartHandshake,
    color: "from-green-500 to-emerald-600",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Browse by Category
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-4">
            Discover books by genre and explore stories tailored to your taste.
          </p>
        </div>

        {/* Categories Grid — 2 cols on mobile, 4 on md+ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {categories.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/books?category=${encodeURIComponent(name)}`}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center text-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={`Browse ${name} books`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-5">
                <div className="p-3 sm:p-4 md:p-5 rounded-full bg-white/20 backdrop-blur-md shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Icon size={28} className="drop-shadow-lg sm:hidden" />
                  <Icon size={40} className="drop-shadow-lg hidden sm:block md:hidden" />
                  <Icon size={48} className="drop-shadow-lg hidden md:block" />
                </div>

                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide text-white group-hover:text-yellow-300 transition-colors duration-300">
                  {name}
                </h3>
              </div>

              {/* Floating Glow Effect */}
              <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;