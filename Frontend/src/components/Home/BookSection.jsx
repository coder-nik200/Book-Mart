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
  limit = 4,
}) => {
  const displayedBooks = books.slice(0, limit);

  return (
    <section className={`${bg} py-16 sm:py-20 lg:py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 lg:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>

            <div className="h-1 w-14 bg-blue-600 rounded-full mt-3" />

            {subtitle && (
              <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && link && (
            <Link
              to={link}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300"
              aria-label={`View all ${title}`}
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
        {displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayedBooks.map((book) => (
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
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              No books available at the moment.
            </p>
            {link && (
              <Link
                to={link}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                Explore all books
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;