import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BookCard from "../BookCard";

const BookSection = ({
  title,
  subtitle,
  link,
  books = [],
  onAddToCart,
  onAddToWishlist,
  bg = "bg-gradient-to-b from-white to-gray-50",
  showViewAll = true,
}) => {
  return (
    <section className={`${bg} py-24`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>

            <div className="h-1 w-16 bg-blue-600 rounded-full mt-4"></div>

            {subtitle && (
              <p className="text-gray-500 mt-4 text-base max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && link && (
            <Link
              to={link}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-600 transition">
                View All
              </span>
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          )}
        </div>

        {/* ================= BOOK GRID ================= */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {books.slice(0, 4).map((book) => (
              <div
                key={book._id}
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <BookCard
                  book={book}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg font-medium">
              No books available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;
