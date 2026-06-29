import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BookCard from "../BookCard";

const BookSection = ({
  title,
  subtitle,
  link,
  books = [],
  onAddToCart,
  bg = "bg-gradient-to-b from-white to-gray-50",
  showViewAll = true,
  limit = 4,
}) => {
  const displayedBooks = books.slice(0, limit);

  return (
    <section className={`${bg} py-10 sm:py-16 lg:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex flex-row items-start justify-between gap-3 mb-8 sm:mb-10 lg:mb-14">

          {/* Left: title + accent line + subtitle */}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
              {title}
            </h2>

            <div className="h-1 w-10 sm:w-14 bg-blue-600 rounded-full mt-2 sm:mt-3" />

            {subtitle && (
              <p className="text-gray-500 mt-3 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: View All button — compact on mobile */}
          {showViewAll && link && (
            <Link
              to={link}
              className="group inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 shrink-0 self-start mt-1"
              aria-label={`View all ${title}`}
            >
              <span className="font-medium text-xs sm:text-sm text-gray-700 group-hover:text-blue-600 transition whitespace-nowrap">
                View All
              </span>
              <ChevronRight
                size={15}
                className="group-hover:translate-x-1 transition-transform duration-300 text-gray-500 group-hover:text-blue-600"
              />
            </Link>
          )}
        </div>

        {/* Book grid — 2 cols on mobile, 3 on md, 4 on lg */}
        {displayedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
            {displayedBooks.map((book) => (
              <div
                key={book._id}
                className="transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <BookCard book={book} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-2xl shadow-sm border border-gray-200 text-center px-4">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📚</div>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg font-medium">
              No books available at the moment.
            </p>
            {link && (
              <Link
                to={link}
                className="mt-3 sm:mt-4 text-blue-600 text-sm sm:text-base font-medium hover:underline"
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