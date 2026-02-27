import { Link } from "react-router-dom";
import { BookOpen, Atom, Landmark, HeartHandshake } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    icon: <BookOpen size={40} />,
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Science",
    icon: <Atom size={40} />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "History",
    icon: <Landmark size={40} />,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Self-Help",
    icon: <HeartHandshake size={40} />,
    color: "from-green-500 to-emerald-600",
  },
];

const CategorySection = () => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          Browse by Category
        </h2>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/books?category=${cat.name}`}
              className="group relative rounded-3xl overflow-hidden p-10 text-center text-white shadow-lg transition duration-500 hover:-translate-y-3"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-90 group-hover:opacity-100 transition`}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="group-hover:scale-110 transition duration-300">
                  {cat.icon}
                </div>

                <h3 className="text-xl font-semibold tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
