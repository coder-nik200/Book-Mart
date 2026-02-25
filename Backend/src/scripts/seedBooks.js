import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

dotenv.config();

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await Book.deleteMany();
    await Category.deleteMany();
    console.log("Old data removed");

    // Create categories
    const categories = await Category.insertMany([
      { name: "Fiction", description: "Fictional novels and stories", icon: "📖" },
      { name: "Science", description: "Scientific and educational books", icon: "🔬" },
      { name: "History", description: "Historical narratives and biographies", icon: "📚" },
      { name: "Self-Help", description: "Personal development and motivational", icon: "🌟" },
      { name: "Fantasy", description: "Fantasy and adventure books", icon: "✨" },
      { name: "Mystery", description: "Mystery and thriller novels", icon: "🔍" },
    ]);

    console.log("Categories created");

    // Create sample books
    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age.",
        price: 12.99,
        discountPrice: 9.99,
        category: categories[0]._id,
        stock: 50,
        rating: 4.5,
        totalReviews: 128,
        isFeatured: true,
        image: { url: "https://via.placeholder.com/300x400?text=The+Great+Gatsby" },
        isbn: "978-0-7432-7356-5",
        publisher: "Charles Scribner's Sons",
        publicationYear: 1925,
        pages: 180,
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        description: "From the Big Bang to Black Holes - a journey through space and time.",
        price: 18.99,
        category: categories[1]._id,
        stock: 30,
        rating: 4.3,
        totalReviews: 256,
        isFeatured: true,
        image: { url: "https://via.placeholder.com/300x400?text=A+Brief+History+of+Time" },
        isbn: "978-0-553-38016-3",
        publisher: "Bantam Press",
        publicationYear: 1988,
        pages: 236,
      },
      {
        title: "1984",
        author: "George Orwell",
        description: "A dystopian novel about totalitarianism and surveillance.",
        price: 14.99,
        discountPrice: 11.99,
        category: categories[0]._id,
        stock: 45,
        rating: 4.7,
        totalReviews: 512,
        isFeatured: true,
        image: { url: "https://via.placeholder.com/300x400?text=1984" },
        isbn: "978-0-451-52493-2",
        publisher: "Signet Classic",
        publicationYear: 1949,
        pages: 328,
      },
      {
        title: "The Power of Now",
        author: "Eckhart Tolle",
        description: "A guide to spiritual enlightenment and living in the present moment.",
        price: 16.99,
        discountPrice: 12.99,
        category: categories[3]._id,
        stock: 60,
        rating: 4.4,
        totalReviews: 389,
        isNewArrival: true,
        image: { url: "https://via.placeholder.com/300x400?text=The+Power+of+Now" },
        isbn: "978-1-57731-152-0",
        publisher: "New World Library",
        publicationYear: 1997,
        pages: 236,
      },
      {
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        description: "The first book in the epic Lord of the Rings trilogy.",
        price: 19.99,
        discountPrice: 14.99,
        category: categories[4]._id,
        stock: 40,
        rating: 4.8,
        totalReviews: 678,
        isBestSeller: true,
        image: { url: "https://via.placeholder.com/300x400?text=The+Fellowship" },
        isbn: "978-0-544-00387-9",
        publisher: "Mariner Books",
        publicationYear: 1954,
        pages: 423,
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        description: "A thrilling mystery involving art, history, and secrets.",
        price: 17.99,
        discountPrice: 13.99,
        category: categories[5]._id,
        stock: 55,
        rating: 4.2,
        totalReviews: 445,
        isBestSeller: true,
        image: { url: "https://via.placeholder.com/300x400?text=The+Da+Vinci+Code" },
        isbn: "978-0-307-40615-3",
        publisher: "Doubleday",
        publicationYear: 2003,
        pages: 683,
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        description: "A fascinating look at human history from the Stone Age to modern times.",
        price: 20.99,
        discountPrice: 15.99,
        category: categories[2]._id,
        stock: 35,
        rating: 4.6,
        totalReviews: 523,
        isFeatured: true,
        isBestSeller: true,
        image: { url: "https://via.placeholder.com/300x400?text=Sapiens" },
        isbn: "978-0-062-31696-5",
        publisher: "HarperCollins",
        publicationYear: 2014,
        pages: 528,
      },
    ];

    await Book.insertMany(sampleBooks);
    console.log("Books seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedBooks();
