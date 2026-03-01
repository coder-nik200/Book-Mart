import Book from "../models/Book.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import mongoose from "mongoose";
export const getAllBooks = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sortMap = {
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1 },
      popularity: { totalReviews: -1 },
    };

    const sortObj = sortMap[sort] || { createdAt: -1 };
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(filter)
      .populate("category")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category");

    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });

    const reviews = await Review.find({ book: book._id }).populate(
      "user",
      "name email",
    );

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      book: {
        ...book.toObject(),
        reviews,
        averageRating: Number(avgRating.toFixed(1)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true })
      .populate("category")
      .limit(8);

    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const books = await Book.find({ isNewArrival: true })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const books = await Book.find({ isBestSeller: true })
      .populate("category")
      .limit(8);

    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;

    if (!rating || !comment)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (exists)
      return res.status(400).json({ message: "Already reviewed this book" });

    await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    const reviews = await Review.find({ book: bookId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
    });

    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      slug: slugify(req.body.title, { lower: true }),
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ book: req.params.id });

    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({ success: true, books: [] });
    }

    const books = await Book.find(
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { author: { $regex: q, $options: "i" } },
        ],
        status: "active",
      },
      {
        title: 1,
        price: 1,
        discountPrice: 1,
        image: 1,
      }
    )
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};