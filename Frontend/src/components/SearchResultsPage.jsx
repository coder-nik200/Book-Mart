import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/books/search?q=${query}`
        );
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading results...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Search results for “{query}”
      </h2>

      {books.length === 0 ? (
        <p className="text-gray-500">No books found</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => navigate(`/book/${book._id}`)}
              className="border rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={
                  book.image?.url
                    ? `http://localhost:5000${book.image.url}`
                    : "https://via.placeholder.com/200x260"
                }
                alt={book.title}
                className="h-52 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-sm line-clamp-2">
                {book.title}
              </h3>
              <p className="text-blue-600 font-bold mt-1">
                ₹{book.discountPrice || book.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;