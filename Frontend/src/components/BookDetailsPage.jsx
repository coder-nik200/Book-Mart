import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  // TEMP: mock data (replace with API later)
  useEffect(() => {
    setBook({
      id,
      title: "Sample Book Title",
      author: "John Doe",
      price: 499,
      description:
        "This is a sample book description. Replace this with real data from backend.",
      image:
        "https://via.placeholder.com/300x400?text=Book+Cover",
    });
  }, [id]);

  if (!book) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Book Image */}
        <img
          src={book.image}
          alt={book.title}
          className="w-full max-w-sm mx-auto rounded-lg shadow"
        />

        {/* Book Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">by {book.author}</p>

          <p className="text-xl font-semibold text-blue-600 mb-4">
            ₹{book.price}
          </p>

          <p className="text-gray-700 mb-6">{book.description}</p>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;