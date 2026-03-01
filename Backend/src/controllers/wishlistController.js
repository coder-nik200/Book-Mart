import Wishlist from "../models/Wishlist.js";
import Book from "../models/Book.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId }).populate(
      "books.book",
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, books: [] });
    }

    const books = wishlist.books.map((item) => ({
      id: item.book._id,
      title: item.book.title,
      author: item.book.author,
      image: item.book.image,
    }));

    res.status(200).json({
      success: true,
      wishlist: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;

    if (!bookId) {
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        books: [{ book: bookId }],
      });
    } else {
      const existingBook = wishlist.books.find(
        (b) => b.book.toString() === bookId,
      );

      if (existingBook) {
        return res
          .status(400)
          .json({ success: false, message: "Book already in wishlist" });
      }

      wishlist.books.push({ book: bookId });
    }

    await wishlist.save();
    await wishlist.populate("books.book");

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    wishlist.books = wishlist.books.filter((b) => b.book.toString() !== bookId);

    await wishlist.save();
    await wishlist.populate("books.book");

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const isInWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        isInWishlist: false,
      });
    }

    const isInWishlist = wishlist.books.some(
      (b) => b.book.toString() === bookId,
    );

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
