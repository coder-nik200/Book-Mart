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
  bg = "bg-white",
  showViewAll = true,
}) => {
  return (
    <section className={`${bg} py-20`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && link && (
            <Link
              to={link}
              className="flex items-center gap-2 text-blue-600 font-medium group transition-all duration-300"
            >
              <span className="group-hover:mr-2 transition-all duration-300">
                View All
              </span>
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition duration-300"
              />
            </Link>
          )}
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.slice(0, 4).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No books available right now.
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;
