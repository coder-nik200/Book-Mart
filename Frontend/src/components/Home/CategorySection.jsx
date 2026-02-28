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
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Discover books by genre and explore stories tailored to your taste.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/books?category=${encodeURIComponent(name)}`}
              className="group relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={`Browse ${name} books`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <Icon size={42} />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold tracking-wide">
                  {name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;