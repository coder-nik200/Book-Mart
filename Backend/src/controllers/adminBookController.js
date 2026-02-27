// import Book from "../models/Book.js";
// import Category from "../models/Category.js";
// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import Review from "../models/Review.js";

// // ==================== GET DASHBOARD STATS ====================
// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments({ role: "customer" });
//     const totalBooks = await Book.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const totalRevenue = await Order.aggregate([
//       { $match: { paymentStatus: "completed" } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);

//     const recentOrders = await Order.find()
//       .populate("user", "name email")
//       .populate("items.book", "title")
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const adminUsers = await User.countDocuments({ role: "admin" });
//     const blockedUsers = await User.countDocuments({ isBlocked: true });

//     res.status(200).json({
//       success: true,
//       stats: {
//         totalUsers,
//         totalBooks,
//         totalOrders,
//         totalRevenue: totalRevenue[0]?.total || 0,
//         totalAdmins: adminUsers,
//         blockedUsers,
//         recentOrders,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== MANAGE BOOKS ====================
// export const addBook = async (req, res) => {
//   try {
//     const { title, author, description, price, discountPrice, category, stock, isbn, publisher, publicationYear, pages, language } = req.body;

//     if (!title || !author || !description || !price || !category || stock === undefined) {
//       return res.status(400).json({ success: false, message: "Required fields are missing" });
//     }

//     const imageUrl = req.file ? req.file.path : "https://via.placeholder.com/300x400?text=" + encodeURIComponent(title);

//     const book = await Book.create({
//       title,
//       author,
//       description,
//       price,
//       discountPrice: discountPrice || null,
//       category,
//       stock,
//       isbn: isbn || null,
//       publisher: publisher || null,
//       publicationYear: publicationYear || null,
//       pages: pages || null,
//       language: language || "English",
//       image: {
//         url: imageUrl,
//       },
//       createdBy: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Book added successfully",
//       book,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const { title, author, description, price, discountPrice, category, stock, isFeatured, isNewArrival, isBestSeller } = req.body;

//     const book = await Book.findByIdAndUpdate(
//       bookId,
//       {
//         title: title || undefined,
//         author: author || undefined,
//         description: description || undefined,
//         price: price || undefined,
//         discountPrice: discountPrice || undefined,
//         category: category || undefined,
//         stock: stock || undefined,
//         isFeatured: isFeatured !== undefined ? isFeatured : undefined,
//         isNewArrival: isNewArrival !== undefined ? isNewArrival : undefined,
//         isBestSeller: isBestSeller !== undefined ? isBestSeller : undefined,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!book) {
//       return res.status(404).json({ success: false, message: "Book not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Book updated successfully",
//       book,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;

//     const book = await Book.findByIdAndDelete(bookId);

//     if (!book) {
//       return res.status(404).json({ success: false, message: "Book not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Book deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== MANAGE CATEGORIES ====================
// export const addCategory = async (req, res) => {
//   try {
//     const { name, description, icon } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Category name is required" });
//     }

//     const category = await Category.create({
//       name,
//       description: description || "",
//       icon: icon || "📚",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Category added",
//       category,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const { name, description, icon, isActive } = req.body;

//     const category = await Category.findByIdAndUpdate(
//       categoryId,
//       {
//         name: name || undefined,
//         description: description || undefined,
//         icon: icon || undefined,
//         isActive: isActive !== undefined ? isActive : undefined,
//       },
//       { new: true }
//     );

//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Category updated",
//       category,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const category = await Category.findByIdAndDelete(categoryId);

//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Category deleted",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== MANAGE USERS ====================
// export const getAllUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;

//     const skip = (page - 1) * limit;

//     const users = await User.find({ role: "customer" })
//       .select("-password")
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 });

//     const total = await User.countDocuments({ role: "customer" });

//     res.status(200).json({
//       success: true,
//       users,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const blockUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true }).select("-password");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User blocked",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const unblockUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true }).select("-password");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User unblocked",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== MANAGE ORDERS ====================
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { orderstatus } = req.body;

//     const order = await Order.findByIdAndUpdate(orderId, { orderstatus }, { new: true }).populate("user", "email");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;

//     const skip = (page - 1) * limit;

//     const orders = await Order.find()
//       .populate("user", "name email")
//       .populate("items.book", "title")
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 });

//     const total = await Order.countDocuments();

//     res.status(200).json({
//       success: true,
//       orders,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== MANAGE REVIEWS ====================
// export const getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate("user", "name email")
//       .populate("book", "title")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       reviews,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     const review = await Review.findByIdAndDelete(reviewId);

//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     // Update book rating
//     const allReviews = await Review.find({ book: review.book });
//     const averageRating = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;

//     await Book.findByIdAndUpdate(review.book, {
//       rating: Math.round(averageRating * 10) / 10,
//       totalReviews: allReviews.length,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Review deleted",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Book from "../models/Book.js";

/* =========================
   GET ALL BOOKS
========================= */
export const getAllBooks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      books,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CREATE BOOK
========================= */
export const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE BOOK
========================= */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE BOOK
========================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};