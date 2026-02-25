import Book from "../models/Book.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";

// ==================== GET ALL BOOKS ====================
export const getAllBooks = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, page = 1, limit = 12 } = req.query;

    let filter = {};

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    // Sorting
    let sortObj = {};
    if (sort === "price-low") sortObj.price = 1;
    else if (sort === "price-high") sortObj.price = -1;
    else if (sort === "newest") sortObj.createdAt = -1;
    else if (sort === "rating") sortObj.rating = -1;
    else if (sort === "popularity") sortObj.totalReviews = -1;
    else sortObj.createdAt = -1;

    // Pagination
    const skip = (page - 1) * limit;

    const books = await Book.find(filter)
      .populate("category")
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET SINGLE BOOK ====================
export const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id)
      .populate("category")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
      });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const reviews = await Review.find({ book: id }).populate("user", "name email");
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.status(200).json({
      success: true,
      book: {
        ...book.toObject(),
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET FEATURED BOOKS ====================
export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true }).populate("category").limit(8);

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET NEW ARRIVALS ====================
export const getNewArrivals = async (req, res) => {
  try {
    const books = await Book.find({ isNewArrival: true }).populate("category").sort({ createdAt: -1 }).limit(8);

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET BEST SELLERS ====================
export const getBestSellers = async (req, res) => {
  try {
    const books = await Book.find({ isBestSeller: true }).populate("category").limit(8);

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADD REVIEW ====================
export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this book" });
    }

    const review = await Review.create({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    // Update book rating
    const allReviews = await Review.find({ book: bookId });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: await review.populate("user", "name email"),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET CATEGORIES ====================
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
